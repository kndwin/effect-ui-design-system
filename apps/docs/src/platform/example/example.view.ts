import { Button } from "@acme/components/button"
import { CodeBlock } from "@acme/components/code-block"
import { Center } from "@acme/components/layout/center"
import { Grid } from "@acme/components/layout/grid"
import { Section } from "@acme/components/layout/section"
import { HStack, StackItem } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { Match } from "effect"
import { ModeSchema } from "../theme/theme.schema.ts"
import { themes } from "../theme/themes.constant.ts"
import { ExampleDef } from "./example.define.ts"
import { ExampleMessageSchema, TabSchema } from "./example.schema.ts"
import { examples } from "./registry.constant.ts"

export const view = ExampleDef.view((h, { tab }) => {
  const { id, theme, mode, style } = h.props
  const example = examples.find((e) => e.id === id)!
  const frame = (frameTheme: string, frameMode: string, labelled: boolean, frameStyle?: string) =>
    Section(h.div, { surface: "base", pad: "6", gap: "4" })
      .attr("data-theme", frameTheme)
      .attr("data-mode", frameMode)
      .attr("style", frameStyle)
      .children(
        Match.value(labelled).pipe(
          Match.when(true, () => Text(h.span, { size: "xs", tone: "muted" }).children(`${frameTheme} · ${frameMode}`)),
          Match.orElse(() => h.span)
        ),
        Center(h.div).children(example.component(h, { key: `${example.id}:${frameTheme}:${frameMode}` }))
      )
  return Section(h.section, { surface: "card" }).children(
    Section(h.div, { pad: "3", divided: true }).children(
      HStack(h.div, { justify: "between", gap: "2", wrap: true }).children(
        StackItem(Text(h.h3, { size: "sm", weight: "medium" }), { grow: true }).children(example.title),
        HStack(h.div, { gap: "1" })
          .attr("role", "tablist")
          .children(
            ...TabSchema.literals.map((t) =>
              Button(h, {
                tone: "ghost",
                size: "sm",
                pressed: tab === t,
                onPress: ExampleMessageSchema.PressedTab({ tab: t }),
                children: t[0]!.toUpperCase() + t.slice(1)
              })
            )
          )
      )
    ),
    Match.value(tab).pipe(
      Match.when("code", () =>
        Section(h.div, { pad: "3" }).children(
          CodeBlock(h, { code: example.source.trim(), title: example.file, key: `code-${example.id}` })
        )
      ),
      Match.when("themes", () =>
        Grid(h.div, { columns: "2", stack: true }).children(
          ...themes.flatMap((t) => ModeSchema.literals.map((m) => frame(t.name, m, true)))
        )
      ),
      Match.orElse(() => frame(theme, mode, false, style))
    )
  )
})
