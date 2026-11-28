import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { ThemeTabs } from "./theme-tabs.component.ts"
import type { ThemeTabsProps } from "./theme-tabs.schema.ts"
import { themesIntro, themingSections } from "./theming.constant.ts"

export const ThemingPage = <Msg>(h: Html.H<Msg>, props: ThemeTabsProps, onCustomize: Msg) => [
  ...themingSections.map((section, index) =>
    VStack(h.section, { gap: "3" }).children(
      Heading(h, section.heading),
      ...Blocks(h, `theming-${index}`, section.blocks, false)
    )
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Themes"),
    Text(h.p).children(themesIntro),
    ThemeTabs(h, { key: "theme-tabs", props, onEmit: { OpenedPanel: () => onCustomize } })
  )
]
