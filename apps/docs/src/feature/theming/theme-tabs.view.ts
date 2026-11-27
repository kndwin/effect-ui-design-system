import { Button } from "@weft/components/button"
import { CodeBlock } from "@weft/components/code-block"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Tabs } from "@weft/components/tabs"
import { Text } from "@weft/components/text"
import { Match } from "effect"
import { sources } from "../../platform/content/content.constant.ts"
import { themes } from "../../platform/theme/themes.constant.ts"
import { ThemeTabsDef } from "./theme-tabs.define.ts"
import { ThemeTabsMessageSchema } from "./theme-tabs.schema.ts"

export const view = ThemeTabsDef.view((h, model) => {
  const { theme, customized, custom, command } = h.props
  const fallback = Match.value(customized).pipe(
    Match.when(true, () => "custom"),
    Match.orElse(() => theme)
  )
  return Tabs(h, {
    key: "themes",
    label: "Themes",
    value: model.tab ?? fallback,
    onSelect: ({ value }) => ThemeTabsMessageSchema.PressedTab({ value }),
    tabs: [
      ...themes.map((shipped) => ({
        value: shipped.name,
        label: shipped.name,
        content: [
          CodeBlock(h, {
            code: sources.themes[shipped.name as keyof typeof sources.themes],
            title: `packages/themes/${shipped.name}/src/${shipped.name}.theme.ts`,
            lineNumbers: true,
            collapsible: true,
            key: `theme-${shipped.name}`
          })
        ]
      })),
      {
        value: "custom",
        label: "custom",
        content: [
          VStack(h.div, { gap: "3" }).children(
            HStack(h.div, { gap: "3", align: "center", justify: "between", wrap: true }).children(
              Text(h.p, { size: "sm", tone: "muted" }).children(
                Match.value(customized).pipe(
                  Match.when(
                    true,
                    () => "Your choices from the theme panel, written as a theme file. It updates as you change them."
                  ),
                  Match.orElse(
                    () =>
                      `Pick custom in the theme panel and this file follows your choices. For now it's ${theme} as a starting point.`
                  )
                )
              ),
              Button(h, { size: "sm", onPress: ThemeTabsMessageSchema.PressedCustomize(), children: "Customize" })
            ),
            Text(h.p, { size: "sm", tone: "muted" }).children(
              "Install it with weft theme. It rebuilds this exact file from the same choices, wired to your copy of the contract. Run it again with --overwrite after changing your choices."
            ),
            CodeBlock(h, { code: command, language: "shell", key: "theme-command" }),
            CodeBlock(h, {
              code: custom,
              title: "src/custom.theme.ts",
              lineNumbers: true,
              collapsible: true,
              key: "theme-custom"
            })
          )
        ]
      }
    ]
  })
})
