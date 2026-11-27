// Vite plugin: compiles *.component.style.ts and *.theme.ts files to static CSS.
//
// Those files export plain data (Style.make / Theme.make). For each one, this plugin asks
// vanilla-extract's compiler to evaluate a generated wrapper that passes the module's exports
// through tools/vite/engine.ts. vanilla-extract only recognises `.css.ts` ids, so the wrapper's
// id is `<file>.acme.css.ts` (virtual, served by the wrapper plugin). The importer then gets the
// compiled exports plus a CSS import.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Compiler, createCompiler } from "@vanilla-extract/compiler"
import type { Plugin } from "vite"

export const styleFile = /\.(component\.style|theme)\.ts$/
const WRAPPER = ".acme.css.ts"
const CSS = ".acme.css"
const engine = fileURLToPath(new URL("./engine.ts", import.meta.url))

const exportNames = (file: string) =>
  [...readFileSync(file, "utf8").matchAll(/^export const (\w+)/gm)].map((m) => m[1]!)

/** Inside the compiler: serve `<file>.acme.css.ts` as a wrapper that runs the engine. */
const wrapper = (): Plugin => ({
  name: "acme-styles-wrapper",
  enforce: "pre",
  resolveId: (id) => (id.endsWith(WRAPPER) ? id : null),
  load(id) {
    if (!id.endsWith(WRAPPER)) return null
    const file = id.slice(0, -WRAPPER.length)
    this.addWatchFile(file)
    const names = exportNames(file)
    return [
      `import * as source from ${JSON.stringify(file)}`,
      `import { register } from ${JSON.stringify(engine)}`,
      `const compiled = register(source)`,
      ...names.map((n) => `export const ${n} = compiled.${n}`)
    ].join("\n")
  }
})

export const acmeStyles = (): Plugin => {
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
      viteConfig: { plugins: [wrapper()] }
    }))
  return {
    name: "acme-styles",
    enforce: "pre",
    configResolved(config) {
      root = config.root
      isBuild = config.command === "build"
    },
    resolveId(source) {
      if (source.endsWith(CSS)) return source
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
      if (id.includes("?") || !styleFile.test(id)) return null
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
