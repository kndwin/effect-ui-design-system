import { tsconfig, viteConfig, weftBase, weftConfig } from "@weft/cli/templates"
import {
  CodeBlockSchema,
  type ContentSection,
  NoticeBlockSchema,
  TextBlockSchema
} from "../../platform/content/block.schema.ts"

const release: string = import.meta.env["VITE_WEFT_RELEASE"]

export const appPackage = `{
  "name": "my-app",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" }
}`

export const cliCommand = `pnpm add -D ${weftBase}/cli@${release}
pnpm weft install`

export const dryRunCommand = "pnpm weft install --dry-run"

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
import { Layer } from "effect"

export const brand = Theme.make(Tokens, {
  name: "brand",
  default: true,
  layer: Layer.mergeAll(
    Layer.succeed(Tokens.Colors, {
      accent: "oklch(0.49 0.22 293)",
      accentFg: "oklch(0.99 0 0)",
      // …every other colour
    }),
    // …Spacing, Size, Radius, Font and the rest of the contract
  ),
  modes: {
    dark: Layer.succeed(Tokens.Colors, { /* the colours in dark */ })
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

const text = (value: string) => TextBlockSchema.make({ text: value })

export const getStartedNotice = NoticeBlockSchema.make({
  text: "Weft components are recipes. You copy their source into your app and own it, like shadcn. Your app depends on @weft/design-system only for token kinds, Theme, Style and the build step. Weft isn't on npm yet: every release is published to pkg.pr.new, and @effect/ui comes from its own pkg.pr.new snapshots. weft install sorts out both."
})

export const getStartedSteps: ReadonlyArray<ContentSection> = [
  {
    heading: "Create your app",
    blocks: [
      text("Start from an empty folder with this package.json."),
      CodeBlockSchema.make({ code: appPackage, title: "package.json", language: "plain" }),
      text(
        "Add the Weft CLI from the latest release, then let it install the rest: Effect, @effect/ui and @effect/ui-kit, @weft/design-system, the Weft Vite plugin, Vite and TypeScript, all pinned to the same release. It uses the package manager your lockfile names, or the one you pass with --package-manager."
      ),
      CodeBlockSchema.make({ code: cliCommand, language: "shell" }),
      text("To see the commands first without running them, pass --dry-run.")
    ]
  },
  {
    heading: "What weft install sets up",
    blocks: [
      text(
        "It also writes three files when they're missing, and keeps yours if they exist. weft.config.ts tells the CLI where things go: paths.ui is where weft add copies components, and paths.themes is where weft theme writes themes. Once you have a theme, list it in themes, and Loom uses it."
      ),
      CodeBlockSchema.make({ code: weftConfig, title: "weft.config.ts" }),
      text(
        "vite.config.ts adds the Weft plugin. It evaluates every *.component.style.ts and *.theme.ts during the build and replaces them with class names and static CSS, so nothing is styled at runtime. In dev it also serves Loom at /__weft/loom: a playground and message scenarios for every *.loom.ts. It also points @/ at src."
      ),
      CodeBlockSchema.make({ code: viteConfig, title: "vite.config.ts" }),
      text("tsconfig.json resolves @/ the same way, so components import as @/components/ui/button."),
      CodeBlockSchema.make({ code: tsconfig, title: "tsconfig.json", language: "plain", collapsible: true })
    ]
  },
  {
    heading: "Add components",
    blocks: [
      text(
        "weft add copies each component into src/components/ui, along with everything it imports: the token contract, shared scales, ui-kit parts and any other component it uses. Imports are rewritten to point at your copies."
      ),
      CodeBlockSchema.make({ code: addCommand, language: "shell" }),
      CodeBlockSchema.make({ code: uiTree, language: "plain" }),
      text(
        "Run it with no names to list every component. A file you already have is kept, so your edits are safe; pass --overwrite to take the latest version instead."
      ),
      CodeBlockSchema.make({ code: listCommand, language: "shell" })
    ]
  },
  {
    heading: "Create your theme",
    blocks: [
      text(
        "A theme fills in every token of your contract, and modes override part of it. weft theme starts yours from a copy of a shipped one (shadcn or astryx), named and wired to your contract."
      ),
      CodeBlockSchema.make({ code: themeCommand, language: "shell" }),
      text(
        "Or design it in the theme panel first: pick custom, choose an accent, radius, density and fonts, and Theming gives you the weft theme command that writes that exact theme."
      ),
      text(
        "Each token group is provided with Layer.succeed, and dark mode is a layer of the groups it changes. Change the values to make it yours, or build one in the theme panel and copy it from Theming. The compiler and the build both fail on a missing token or a bad value."
      ),
      CodeBlockSchema.make({ code: themeFile, title: "src/brand.theme.ts" })
    ]
  },
  {
    heading: "Mount and render",
    blocks: [
      text("Importing the theme adds its CSS variables."),
      CodeBlockSchema.make({ code: indexFile, title: "index.html", language: "plain" }),
      CodeBlockSchema.make({ code: mainFile, title: "src/main.ts" }),
      CodeBlockSchema.make({ code: appFile, title: "src/app.component.ts", lineNumbers: true }),
      CodeBlockSchema.make({ code: devCommand, language: "shell" })
    ]
  },
  {
    heading: "Make it yours",
    blocks: [
      text(
        'The components are your code now. Change a style file and the CSS rebuilds; add a variant, a part or a token as you need. Add data-mode="dark" to any element to switch the mode below it. Theming covers the contract in depth, and Templates show whole pages built from these components.'
      )
    ]
  }
]
