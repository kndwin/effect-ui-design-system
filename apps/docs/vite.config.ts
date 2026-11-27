import { readFileSync } from "node:fs"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig, type Plugin } from "vite"

/**
 * `import text from "./x.css.ts?source"` → the file's text.
 * Vite's own `?raw` doesn't work for `.css.ts`: vanilla-extract claims those first.
 */
const source = (): Plugin => ({
  name: "docs-source",
  enforce: "pre",
  async resolveId(id, importer) {
    if (!id.endsWith("?source")) return null
    const resolved = await this.resolve(id.slice(0, -"?source".length), importer, { skipSelf: true })
    // the id must not end in .css.ts, or vanilla-extract picks it up
    return resolved ? `\0source:${resolved.id.split("?")[0]}::text` : null
  },
  load(id) {
    if (!id.startsWith("\0source:")) return null
    const file = id.slice("\0source:".length, -"::text".length)
    this.addWatchFile(file)
    return `export default ${JSON.stringify(readFileSync(file, "utf8"))}`
  }
})

export default defineConfig({ plugins: [source(), vanillaExtractPlugin()] })
