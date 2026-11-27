export const effectVersion = "4.1.6"

export const effectUiCommit = "9dc3482"

export const effectUiBase = "https://pkg.pr.new/Effect-TS/ui/@effect"

export const weftBase = "https://pkg.pr.new/kndwin/weft/@weft"

export const viteConfig = `import { makePlugin } from "@weft/css-engine/vite"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    makePlugin({
      include: /\\.(component\\.style|theme)\\.ts$/,
      adapter: "@weft/design-system/Compile"
    })
  ]
})
`

export const tsconfig = `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "vite.config.ts"]
}
`

export const componentsJson = `{
  "ui": "src/components/ui",
  "themes": "src"
}
`
