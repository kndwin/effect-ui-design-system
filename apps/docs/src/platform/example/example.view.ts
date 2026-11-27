import { Button } from "@weft/components/button"
import { CodeBlock } from "@weft/components/code-block"
import { Center } from "@weft/components/layout/center"
import { Section } from "@weft/components/layout/section"
import { HStack, StackItem } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { Match } from "effect"
import { ExampleDef } from "./example.define.ts"
import { ExampleMessageSchema, TabSchema } from "./example.schema.ts"
import { examples } from "./registry.constant.ts"

export const view = ExampleDef.view((h, { tab }) => {
  const { id } = h.props
  const example = examples.find((e) => e.id === id)!
  const frame = Section(h.div, { surface: "base", pad: "6", gap: "4" }).children(
    Center(h.div).children(example.component(h, { key: example.id }))
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
      Match.orElse(() => frame)
    )
  )
})
