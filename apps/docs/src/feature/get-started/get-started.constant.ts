export const cloneCommand = `git clone --recurse-submodules https://github.com/kndwin/weft
cd weft
pnpm install
pnpm docs`

export const appPackage = `{
  "name": "my-app",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": {
    "@weft/components": "workspace:*",
    "@weft/theme-shadcn": "workspace:*",
    "@effect/ui": "link:../../vendor/effect-ui/packages/ui",
    "@effect/ui-kit": "link:../../vendor/effect-ui/packages/ui-kit",
    "effect": "4.1.6"
  },
  "devDependencies": {
    "@weft/css-engine": "workspace:*",
    "@weft/design-system": "workspace:*",
    "vite": "8.3.8"
  }
}`

export const viteConfig = `import { makePlugin } from "@weft/css-engine/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    makePlugin({
      include: /\\.(component\\.style|theme)\\.ts$/,
      adapter: "@weft/design-system/Compile"
    })
  ]
})`

export const mainFile = `import "@weft/theme-shadcn"
import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { App } from "./app.component.ts"

BrowserHost.mount(App, {}, document.getElementById("root")!).pipe(Layer.launch, Effect.runFork)`

export const appFile = `import { Button } from "@weft/components/button"
import { Layout, LayoutContent } from "@weft/components/layout/layout"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

const Msg = UiSchema.TaggedEnum({ Pressed: {} })

export const App = Html.component({ name: "App", model: Schema.Number, message: Msg }).make({
  init: () => 0,
  update: { Pressed: ($) => $.model + 1 },
  view: (h, count) =>
    Layout(h.div)
      .attr("data-theme", "shadcn")
      .attr("data-mode", "light")
      .children(
        LayoutContent(h.main).children(
          VStack(h.div, { gap: "3" }).children(
            Text(h.h1, { size: "2xl", weight: "semibold" }).children("Hello, Weft"),
            Button(h, { tone: "primary", onPress: Msg.Pressed(), children: \`Pressed \${count} times\` })
          )
        )
      )
})`

export const themeFile = `import { Tokens } from "@weft/components/tokens"
import * as Theme from "@weft/design-system/Theme"

export const brand = Theme.make(Tokens, {
  name: "brand",
  values: {
    Colors: { accent: "#6d28d9", accentFg: "#ffffff" /* every other token too */ }
    /* Spacing, Size, Radius, Font, … */
  }
})`
