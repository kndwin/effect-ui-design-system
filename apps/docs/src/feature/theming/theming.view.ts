import { CodeBlock } from "@acme/components/code-block"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import type { Html } from "@effect/ui/html"
import { sources } from "../../platform/content/content.constant.ts"
import { themes } from "../../platform/theme/themes.constant.ts"
import { Heading } from "../../platform/ui/ui.view.ts"

export const ThemingPage = <Msg>(h: Html.H<Msg>) => [
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "The contract"),
    Text(h.p).children(
      "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected."
    ),
    CodeBlock(h, {
      code: sources.contract,
      title: "packages/components/src/platform/token/contract.token.ts",
      lineNumbers: true,
      key: "contract"
    })
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "A theme"),
    Text(h.p).children(
      'Theme.make won\'t compile unless every key is filled in. Values are decoded at build time, so "purple" for a colour fails the build with the theme, mode and path. Or open the theme panel to make one.'
    ),
    ...themes.map((theme) =>
      CodeBlock(h, {
        code: sources.themes[theme.name as keyof typeof sources.themes],
        title: `packages/themes/${theme.name}/src/${theme.name}.theme.ts`,
        lineNumbers: true,
        key: `theme-${theme.name}`
      })
    )
  )
]
