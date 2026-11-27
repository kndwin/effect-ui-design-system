import { CodeBlock } from "@weft/components/code-block"
import { Section } from "@weft/components/layout/section"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import type { Input } from "@effect/ui/View"
import {
  appFile,
  addCommand,
  appPackage,
  cloneCommand,
  copyTheme,
  devCommand,
  listCommand,
  mainFile,
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
      "Weft components are recipes. You copy their source into your app and own it, like shadcn. Your app depends on @weft/design-system only for token kinds, Theme, Style and the build step. Weft and @effect/ui aren't on npm yet, so for now build your app inside the Weft workspace."
    )
  ),
  Step(h, 1, "Get the workspace", [
    Note(h, "Clone with the effect-ui submodule, install, and start these docs to check everything runs."),
    CodeBlock(h, { code: cloneCommand, language: "shell", key: "clone" })
  ]),
  Step(h, 2, "Add your app", [
    Note(
      h,
      "Create apps/my-app with this package.json, then run pnpm install again so the workspace links it. There's no @weft/components or theme package in it: @weft/cli copies the components in, and you write the theme."
    ),
    CodeBlock(h, { code: appPackage, title: "apps/my-app/package.json", language: "plain", key: "package" }),
    Note(h, "Point @/ at src so components import as @/components/ui/button."),
    CodeBlock(h, { code: tsconfig, title: "apps/my-app/tsconfig.json", language: "plain", key: "tsconfig" })
  ]),
  Step(h, 3, "Compile styles at build time", [
    Note(
      h,
      "The CSS engine evaluates every *.component.style.ts and *.theme.ts during the build and replaces them with class names and static CSS. It uses the same @/ alias, and nothing is styled at runtime."
    ),
    CodeBlock(h, { code: viteConfig, title: "apps/my-app/vite.config.ts", key: "vite" })
  ]),
  Step(h, 4, "Add components", [
    Note(
      h,
      "Run weft add from apps/my-app with the components you need. It copies each one into src/components/ui, along with everything it imports: the token contract, shared scales, ui-kit parts and any other component it uses. Imports are rewritten to point at your copies."
    ),
    CodeBlock(h, { code: addCommand, language: "shell", key: "add" }),
    CodeBlock(h, { code: uiTree, language: "plain", key: "tree" }),
    Note(
      h,
      "Run it with no names to list every component. A file you already have is kept, so your edits are safe; pass --overwrite to take the latest version instead."
    ),
    CodeBlock(h, { code: listCommand, language: "shell", key: "list" })
  ]),
  Step(h, 5, "Create your theme", [
    Note(
      h,
      "A theme fills in every token of your contract, and modes override part of it. Start from a copy of a shipped theme rather than an empty file."
    ),
    CodeBlock(h, { code: copyTheme, language: "shell", key: "copy-theme" }),
    Note(
      h,
      "Import Tokens from your contract and give the theme your own name and values. default: true applies it to the whole page. To try values first, pick custom in the theme panel. The compiler and the build both fail on a missing token or a bad value."
    ),
    CodeBlock(h, { code: themeFile, title: "apps/my-app/src/brand.theme.ts", key: "theme" })
  ]),
  Step(h, 6, "Mount and render", [
    Note(
      h,
      "Importing the theme adds its CSS variables. Add an index.html with a #root element and a module script for src/main.ts."
    ),
    CodeBlock(h, { code: mainFile, title: "apps/my-app/src/main.ts", key: "main" }),
    CodeBlock(h, { code: appFile, title: "apps/my-app/src/app.component.ts", lineNumbers: true, key: "app" }),
    CodeBlock(h, { code: devCommand, language: "shell", key: "dev" })
  ]),
  Step(h, 7, "Make it yours", [
    Note(
      h,
      'The components are your code now. Change a style file and the CSS rebuilds; add a variant, a part or a token as you need. Add data-mode="dark" to any element to switch the mode below it. Theming covers the contract in depth, and Templates show whole pages built from these components.'
    )
  ])
]
