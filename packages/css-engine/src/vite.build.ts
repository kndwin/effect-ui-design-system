import { existsSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { Effect } from "effect"
import { createServer, isRunnableDevEnvironment, type Plugin, type ViteDevServer } from "vite"
import { compileFile, EvaluationError, ModuleLoader } from "./engine.build.ts"

export interface Options {
  readonly include: RegExp
  readonly adapter: string
}

const CSS = ".acme.css"
const runtimeImport = fileURLToPath(new URL("./runtime.pure.ts", import.meta.url))

export const cssEngine = (options: Options): Plugin => {
  let root = process.cwd()
  let isBuild = false
  let inner: Promise<ViteDevServer> | undefined
  const sheets = new Map<string, string>()
  const dependents = new Map<string, Set<string>>()

  const server = () =>
    (inner ??= createServer({
      root,
      configFile: false,
      logLevel: "silent",
      appType: "custom",
      server: { middlewareMode: true, hmr: false, watch: null },
      optimizeDeps: { noDiscovery: true, include: [] }
    }))

  const environment = async () => {
    const env = (await server()).environments.ssr
    if (!env || !isRunnableDevEnvironment(env)) throw new Error("css-engine: the ssr environment can't run modules")
    return env
  }

  const load = (id: string, importer?: string) =>
    Effect.tryPromise({
      try: async () => {
        const env = await environment()
        const resolved = importer ? ((await env.pluginContainer.resolveId(id, importer))?.id ?? id) : id
        return (await env.runner.import(resolved)) as Record<string, unknown>
      },
      catch: (cause) => new EvaluationError({ file: id, cause })
    })

  const track = async (file: string) => {
    const env = await environment()
    const seen = new Set<string>()
    const visit = (id: string | undefined) => {
      const node = id ? env.moduleGraph.getModuleById(id) : undefined
      if (!node?.file || seen.has(node.file) || node.file.includes("node_modules")) return
      seen.add(node.file)
      for (const child of node.importedModules) visit(child.id ?? undefined)
    }
    visit(file)
    for (const dep of seen) dependents.set(dep, (dependents.get(dep) ?? new Set()).add(file))
  }

  const compile = async (file: string) => {
    const result = await Effect.runPromise(
      compileFile(file, {
        adapter: options.adapter,
        scope: relative(root, file),
        debug: !isBuild,
        cssImport: file + CSS,
        runtimeImport
      }).pipe(Effect.provideService(ModuleLoader, { load }))
    )
    sheets.set(file, result.css)
    await track(file)
    return result
  }

  return {
    name: "css-engine",
    enforce: "pre",
    configResolved(config) {
      root = config.root
      isBuild = config.command === "build"
    },
    resolveId: (source) => (source.endsWith(CSS) ? source : null),
    async load(id) {
      if (!id.endsWith(CSS)) return null
      const absolute = id.slice(0, -CSS.length)
      const file = existsSync(absolute) ? absolute : join(root, absolute)
      if (!sheets.has(file)) await compile(file)
      return sheets.get(file) ?? ""
    },
    async transform(_code, id) {
      if (id.includes("?") || !options.include.test(id)) return null
      try {
        return { code: (await compile(id)).code, map: null }
      } catch (error) {
        return this.error(error instanceof Error ? error.message : String(error))
      }
    },
    async handleHotUpdate({ file, server: outer, modules }) {
      const styles = dependents.get(file)
      if (!styles || !inner) return
      const env = await environment()
      env.moduleGraph.invalidateAll()
      env.runner.clearCache()
      const affected = new Set(modules)
      for (const style of styles) {
        for (const id of [style, style + CSS]) {
          const mod = outer.moduleGraph.getModuleById(id)
          if (mod) {
            outer.moduleGraph.invalidateModule(mod)
            affected.add(mod)
          }
        }
      }
      return [...affected]
    },
    async buildEnd() {
      const closing = inner
      inner = undefined
      if (closing) await (await closing).close()
    }
  }
}
