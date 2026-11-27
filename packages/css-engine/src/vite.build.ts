// The css-engine Vite plugin: compiles the files matching `include` to static CSS.
//
//   cssEngine({ include: /\.component\.style\.ts$/, adapter: "@acme/ds/Compile" })
//
// Matching files export plain data. For each one, the plugin evaluates (inside vanilla-extract's
// compiler) a generated wrapper that hands the module's exports to `register(exports, compile)`,
// where `compile` is the adapter's export. vanilla-extract only recognises `.css.ts` ids, so the
// wrapper's id is `<file>.acme.css.ts`. Importers get the compiled exports plus a CSS import.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Compiler, createCompiler } from "@vanilla-extract/compiler"
import type { Plugin } from "vite"

const WRAPPER = ".acme.css.ts"
const CSS = ".acme.css"
const register = fileURLToPath(new URL("./register.build.ts", import.meta.url))

export interface Options {
  /** which files are style data */
  readonly include: RegExp
  /** module specifier (resolved from each matching file) whose `compile` export is the Adapter */
  readonly adapter: string
}

const exportNames = (file: string) =>
  [...readFileSync(file, "utf8").matchAll(/^export const (\w+)/gm)].map((m) => m[1]!)

/** Inside the compiler: serve `<file>.acme.css.ts` as a wrapper that runs the engine. */
/**
 * vanilla-extract is this package's dependency, not the style file's: resolve its imports
 * (the compiler's file-scope imports, the compiled recipes' runtime) from here.
 */
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
  /** file → the style/theme modules that depend on it, for hot updates */
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
      // in dev, compiled modules also import their wrapper id; outside the compiler it's empty
      if (source.endsWith(WRAPPER)) return `\0${source}`
      return null
    },
    async load(id) {
      if (id.startsWith("\0") && id.endsWith(WRAPPER)) return "export {}"
      if (!id.endsWith(CSS)) return null
      // some hosts (vitest) hand back root-relative ids: /src/… instead of /abs/…/src/…
      const absolute = id.slice(0, -CSS.length)
      const file = existsSync(absolute) ? absolute : join(root, absolute)
      // the CSS can be asked for before its module is compiled in this process (cached transforms)
      await ensure().processVanillaFile(file + WRAPPER, { outputCss: true })
      return ensure().getCssForFile(file + WRAPPER).css
    },
    async transform(_code, id) {
      // only the plain module: `?raw` and other queries are left alone
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
    // called at the end of a build, and when a dev or test server closes
    async buildEnd() {
      await compiler?.close()
      compiler = undefined
    },
    async closeWatcher() {
      await compiler?.close()
    }
  }
}
