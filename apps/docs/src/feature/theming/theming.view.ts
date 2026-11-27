import { CodeBlock } from "@weft/components/code-block"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { sources } from "../../platform/content/content.constant.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { ThemeTabs } from "./theme-tabs.component.ts"
import type { ThemeTabsProps } from "./theme-tabs.schema.ts"

const layerExample = `Layer.succeed(Tokens.Colors, {
  surface: "oklch(1 0 0)",
  accent: "oklch(0.49 0.22 293)",
  // …every key of Colors
})`

export const ThemingPage = <Msg>(h: Html.H<Msg>, props: ThemeTabsProps, onCustomize: Msg) => [
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "The contract"),
    Text(h.p).children(
      "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected. Every group is also an Effect Context key, which is what a theme provides."
    ),
    CodeBlock(h, {
      code: sources.contract,
      title: "packages/components/src/platform/token/contract.token.ts",
      lineNumbers: true,
      collapsible: true,
      key: "contract"
    })
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Values are layers"),
    Text(h.p).children(
      "A theme provides a value for each group, the way an app provides services: Layer.succeed with the group as the key. Layer.succeed checks every key of the group, and Theme.make needs a layer that provides every group, so a missing token doesn't compile."
    ),
    CodeBlock(h, { code: layerExample, key: "layer" }),
    Text(h.p).children(
      'Modes are layers too. A mode provides only the groups it changes, and only values that differ are written. Values are decoded at build time, so "purple" for a colour fails the build with the theme, mode and path.'
    )
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Themes"),
    Text(h.p).children(
      "The two shipped themes, and yours. weft theme copies a shipped one into your app; custom is what the theme panel builds."
    ),
    ThemeTabs(h, { key: "theme-tabs", props, onEmit: { OpenedPanel: () => onCustomize } })
  )
]
