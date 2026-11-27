import { CodeBlock } from "@weft/components/code-block"
import { Section } from "@weft/components/layout/section"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import type { Input } from "@effect/ui/View"
import { appFile, appPackage, cloneCommand, mainFile, themeFile, viteConfig } from "./get-started.constant.ts"

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

export const GetStartedPage = <Msg>(h: Html.H<Msg>) => [
  Section(h.div, { surface: "muted", pad: "4" }).children(
    Text(h.p, { size: "sm" }).children(
      "Weft and @effect/ui aren't on npm yet. Until they are, build your app inside the Weft workspace: the packages link to each other, and ui-kit is a git submodule."
    )
  ),
  Step(h, 1, "Get the workspace", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Clone with the effect-ui submodule, install, and start these docs to check everything runs."
    ),
    CodeBlock(h, { code: cloneCommand, language: "shell", key: "clone" })
  ]),
  Step(h, 2, "Add your app", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Create apps/my-app with this package.json, then run pnpm install again so the workspace links it."
    ),
    CodeBlock(h, { code: appPackage, title: "apps/my-app/package.json", language: "plain", key: "package" })
  ]),
  Step(h, 3, "Compile styles at build time", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "The CSS engine evaluates every *.component.style.ts and *.theme.ts during the build and replaces them with class names and static CSS. Nothing is styled at runtime."
    ),
    CodeBlock(h, { code: viteConfig, title: "apps/my-app/vite.config.ts", key: "vite" })
  ]),
  Step(h, 4, "Load a theme and mount", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Importing a theme package adds its CSS variables. Import more than one to switch between them."
    ),
    CodeBlock(h, { code: mainFile, title: "apps/my-app/src/main.ts", key: "main" }),
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Add an index.html with a #root element and a module script pointing at src/main.ts."
    )
  ]),
  Step(h, 5, "Use the components", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "data-theme and data-mode on any element pick the theme below it. Every component reads only the token contract, so they all follow."
    ),
    CodeBlock(h, { code: appFile, title: "apps/my-app/src/app.component.ts", lineNumbers: true, key: "app" }),
    CodeBlock(h, { code: "pnpm --filter my-app dev", language: "shell", key: "dev" })
  ]),
  Step(h, 6, "Make it yours", [
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Open the theme panel and pick custom to try accents, radius, density and fonts live. To ship your own theme, fill in every token of the contract; the build fails on a missing key or a bad value."
    ),
    CodeBlock(h, { code: themeFile, title: "packages/themes/brand/src/brand.theme.ts", key: "theme" }),
    Text(h.p, { size: "sm", tone: "muted" }).children(
      "Theming walks through the contract and both shipped themes, Tokens lists every value, and Templates show whole pages built from the components."
    )
  ])
]
