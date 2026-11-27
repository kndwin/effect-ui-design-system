import { CodeBlock } from "@weft/components/code-block"
import { Section } from "@weft/components/layout/section"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import type { Input } from "@effect/ui/View"
import {
  addCommand,
  appFile,
  appPackage,
  devCommand,
  indexFile,
  installCommand,
  listCommand,
  mainFile,
  themeCommand,
  themeFile,
  tsconfig,
  uiTree,
  viteConfig
} from "./get-started.constant.ts"

const Step = <Msg>(h: Html.H<Msg>, index: number, title: string, children: ReadonlyArray<Input<Msg>>) =>
  HStack(h.section, { gap: "4", align: "start" }).children(
    Section(h.span, { surface: "muted", pad: "1" })
      .attr("aria-hidden", "true")
      .attr("style", "min-width:2rem;text-align:center;border-radius:9999px")
      .children(Text(h.span, { size: "sm", weight: "semibold" }).children(String(index))),
    StackItem(VStack(h.div, { gap: "3" }), { grow: true })
      .attr("style", "min-width:0")
      .children(Text(h.h2, { size: "lg", weight: "semibold" }).children(title), ...children)
  )

const Note = <Msg>(h: Html.H<Msg>, text: string) => Text(h.p, { size: "sm", tone: "muted" }).children(text)

export const GetStartedPage = <Msg>(h: Html.H<Msg>) => [
  Section(h.div, { surface: "muted", pad: "4" }).children(
    Text(h.p, { size: "sm" }).children(
      "Weft components are recipes. You copy their source into your app and own it, like shadcn. Your app depends on @weft/design-system only for token kinds, Theme, Style and the build step. Weft isn't on npm yet: every commit to main is published to pkg.pr.new, and @effect/ui comes from its own pkg.pr.new snapshots."
    )
  ),
  Step(h, 1, "Create your app", [
    Note(h, "Start from an empty folder with this package.json."),
    CodeBlock(h, { code: appPackage, title: "package.json", language: "plain", key: "package" }),
    Note(
      h,
      "Install Effect, @effect/ui and Weft. @weft/css-engine compiles styles at build time, and @weft/cli copies components into your app."
    ),
    CodeBlock(h, { code: installCommand, language: "shell", key: "install" })
  ]),
  Step(h, 2, "Configure TypeScript and Vite", [
    Note(h, "Point @/ at src so components import as @/components/ui/button."),
    CodeBlock(h, { code: tsconfig, title: "tsconfig.json", language: "plain", key: "tsconfig" }),
    Note(
      h,
      "The CSS engine evaluates every *.component.style.ts and *.theme.ts during the build and replaces them with class names and static CSS. Nothing is styled at runtime."
    ),
    CodeBlock(h, { code: viteConfig, title: "vite.config.ts", key: "vite" })
  ]),
  Step(h, 3, "Add components", [
    Note(
      h,
      "weft add copies each component into src/components/ui, along with everything it imports: the token contract, shared scales, ui-kit parts and any other component it uses. Imports are rewritten to point at your copies."
    ),
    CodeBlock(h, { code: addCommand, language: "shell", key: "add" }),
    CodeBlock(h, { code: uiTree, language: "plain", key: "tree" }),
    Note(
      h,
      "Run it with no names to list every component. A file you already have is kept, so your edits are safe; pass --overwrite to take the latest version instead."
    ),
    CodeBlock(h, { code: listCommand, language: "shell", key: "list" })
  ]),
  Step(h, 4, "Create your theme", [
    Note(
      h,
      "A theme fills in every token of your contract, and modes override part of it. weft theme starts yours from a copy of a shipped one (shadcn or astryx), named and wired to your contract."
    ),
    CodeBlock(h, { code: themeCommand, language: "shell", key: "theme-command" }),
    Note(
      h,
      "Change the values to make it yours. To try values first, pick custom in the theme panel. The compiler and the build both fail on a missing token or a bad value."
    ),
    CodeBlock(h, { code: themeFile, title: "src/brand.theme.ts", key: "theme" })
  ]),
  Step(h, 5, "Mount and render", [
    Note(h, "Importing the theme adds its CSS variables."),
    CodeBlock(h, { code: indexFile, title: "index.html", language: "plain", key: "index" }),
    CodeBlock(h, { code: mainFile, title: "src/main.ts", key: "main" }),
    CodeBlock(h, { code: appFile, title: "src/app.component.ts", lineNumbers: true, key: "app" }),
    CodeBlock(h, { code: devCommand, language: "shell", key: "dev" })
  ]),
  Step(h, 6, "Make it yours", [
    Note(
      h,
      'The components are your code now. Change a style file and the CSS rebuilds; add a variant, a part or a token as you need. Add data-mode="dark" to any element to switch the mode below it. Theming covers the contract in depth, and Templates show whole pages built from these components.'
    )
  ])
]
