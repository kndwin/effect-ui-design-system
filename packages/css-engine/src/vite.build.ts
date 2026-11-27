import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Compiler, createCompiler } from "@vanilla-extract/compiler"
import type { Plugin } from "vite"

const WRAPPER = ".acme.css.ts"
const CSS = ".acme.css"
const register = fileURLToPath(new URL("./register.build.ts", import.meta.url))

export interface Options {
  readonly include: RegExp

  readonly adapter: string
}

const exportNames = (file: string) =>
  [...readFileSync(file, "utf8").matchAll(/^export const (\w+)/gm)].map((m) => m[1]!)

async function resolveFromEngine(
  this: { resolve: (s: string, i?: string, o?: { skipSelf?: boolean }) => Promise<unknown> },
  source: string
) {
  return source.startsWith("@vanilla-extract/") ? this.resolve(source, register, { skipSelf: true }) : null
}

const wrapper = (adapter: string): Plugin => ({
  name: "css-engine-wrapper",
  enforce: "pre",
  async resolveId(id) {
    if (id.endsWith(WRAPPER)) return id
    return (await resolveFromEngine.call(this, id)) as never
  },
  load(id) {
    if (!id.endsWith(WRAPPER)) return null
    const file = id.slice(0, -WRAPPER.length)
    this.addWatchFile(file)
    const names = exportNames(file)
    return [
      `import * as source from ${JSON.stringify(file)}`,
      `import { register } from ${JSON.stringify(register)}`,
      `import { compile } from ${JSON.stringify(adapter)}`,
      `const compiled = register(source, compile)`,
      ...names.map((n) => `export const ${n} = compiled.${n}`)
    ].join("\n")
  }
})

export const cssEngine = (options: Options): Plugin => {
  let compiler: Compiler | undefined

  const dependents = new Map<string, Set<string>>()
  let root = process.cwd()
  let isBuild = false
  const ensure = () =>
    (compiler ??= createCompiler({
      root,
      identifiers: isBuild ? "short" : "debug",
      enableFileWatcher: !isBuild,
      cssImportSpecifier: (id) => id.replace(WRAPPER, "") + CSS,
      viteConfig: { plugins: [wrapper(options.adapter)] }
    }))
  return {
    name: "css-engine",
    enforce: "pre",
    configResolved(config) {
      root = config.root
      isBuild = config.command === "build"
    },
    async resolveId(source) {
      if (source.endsWith(CSS)) return source
      const engineDep = await resolveFromEngine.call(this, source)
      if (engineDep) return engineDep as never

      if (source.endsWith(WRAPPER)) return `\0${source}`
      return null
    },
    async load(id) {
      if (id.startsWith("\0") && id.endsWith(WRAPPER)) return "export {}"
      if (!id.endsWith(CSS)) return null

      const absolute = id.slice(0, -CSS.length)
      const file = existsSync(absolute) ? absolute : join(root, absolute)

      await ensure().processVanillaFile(file + WRAPPER, { outputCss: true })
      return ensure().getCssForFile(file + WRAPPER).css
    },
    async transform(_code, id) {
      if (id.includes("?") || !options.include.test(id)) return null
      const { source, watchFiles } = await ensure().processVanillaFile(id + WRAPPER, { outputCss: true })
      for (const watched of [id, ...watchFiles]) {
        const file = watched.replace(WRAPPER, "").split("?")[0]!
        if (file.includes("node_modules")) continue
        if (file !== id) this.addWatchFile(file)
        dependents.set(file, (dependents.get(file) ?? new Set()).add(id))
      }
      return { code: source, map: { mappings: "" } }
    },
    async handleHotUpdate({ file, server, modules }) {
      const styles = dependents.get(file)
      if (!styles || !compiler) return
      await compiler.unstable_invalidateAllModules()
      const affected = new Set(modules)
      for (const style of styles) {
        for (const id of [style, style + CSS]) {
          const mod = server.moduleGraph.getModuleById(id)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            affected.add(mod)
          }
        }
      }
      return [...affected]
    },

    async buildEnd() {
      await compiler?.close()
      compiler = undefined
    },
    async closeWatcher() {
      await compiler?.close()
    }
  }
}
