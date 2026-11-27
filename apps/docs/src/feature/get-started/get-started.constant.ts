const weft = "https://pkg.pr.new/kndwin/effect-ui-design-system/@weft"
const effectUi = "https://pkg.pr.new/Effect-TS/ui/@effect"
const effectUiCommit = "9dc3482"

export const appPackage = `{
  "name": "my-app",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" }
}`

export const installCommand = `pnpm add effect@4.1.6 \\
  ${effectUi}/ui@${effectUiCommit} \\
  ${effectUi}/ui-kit@${effectUiCommit} \\
  ${weft}/design-system@main
pnpm add -D vite@8 typescript \\
  ${weft}/css-engine@main \\
  ${weft}/cli@main`

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
})`

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
}`

export const addCommand = "pnpm weft add button text stack layout"

export const listCommand = "pnpm weft add"

export const uiTree = `src/components/ui/
  tokens.ts                   the token contract
  scales.ts                   sizes and tones shared by components
  button.ts                   import { Button } from "@/components/ui/button"
  button.component.style.ts   compiled to CSS at build time
  button.parts.constant.ts    ui-kit parts and states it styles
  text.ts  stack.ts  layout.ts  …`

export const themeCommand = "pnpm weft theme shadcn --name brand"

export const themeFile = `import { Tokens } from "./components/ui/tokens.ts"
import * as Theme from "@weft/design-system/Theme"

export const brand = Theme.make(Tokens, {
  name: "brand",
  default: true,
  values: {
    Colors: {
      accent: "oklch(0.49 0.22 293)",
      accentFg: "oklch(0.99 0 0)",
      // …every other colour
    },
    // …Spacing, Size, Radius, Font and the rest of the contract
  },
  modes: {
    dark: { Colors: { /* only what changes in dark */ } }
  }
})`

export const mainFile = `import "./brand.theme.ts"
import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { App } from "./app.component.ts"

const root = document.getElementById("root")!
BrowserHost.mount(App, {}, root).pipe(Layer.launch, Effect.runFork)`

export const appFile = `import { Button } from "@/components/ui/button"
import { Layout, LayoutContent } from "@/components/ui/layout"
import { VStack } from "@/components/ui/stack"
import { Text } from "@/components/ui/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

const Msg = UiSchema.TaggedEnum({ Pressed: {} })

export const App = Html.component({ name: "App", model: Schema.Number, message: Msg }).make({
  init: () => 0,
  update: { Pressed: ($) => $.model + 1 },
  view: (h, count) =>
    Layout(h.div).children(
      LayoutContent(h.main).children(
        VStack(h.div, { gap: "3" }).children(
          Text(h.h1, { size: "2xl", weight: "semibold" }).children("Hello, Weft"),
          Button(h, { tone: "primary", onPress: Msg.Pressed(), children: \`Pressed \${count} times\` })
        )
      )
    )
})`

export const indexFile = `<!doctype html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`

export const devCommand = "pnpm dev"
