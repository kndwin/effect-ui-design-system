import { CodeBlock } from "@weft/components/code-block"
import { Center } from "@weft/components/layout/center"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { ExampleDef } from "./example.define.ts"
import { mapSourceToRecipe } from "./example.pure.map.ts"
import { examples } from "./registry.constant.ts"

export const view = ExampleDef.view((h) => {
  const example = examples.find((e) => e.id === h.props.id)!
  return Section(h.section, { surface: "card" }).children(
    Section(h.div, { pad: "3", divided: true }).children(
      Text(h.h3, { size: "sm", weight: "medium" }).children(example.title)
    ),
    Section(h.div, { surface: "base", pad: "6", gap: "4" })
      .attr("data-example-preview", "")
      .children(Center(h.div).children(example.component(h, { key: example.id }))),
    Section(h.div, { pad: "3" }).children(
      CodeBlock(h, {
        code: mapSourceToRecipe({ source: example.source.trim() }),
        title: example.file,
        lineNumbers: true,
        collapsible: true,
        key: `code-${example.id}`
      })
    )
  )
})
