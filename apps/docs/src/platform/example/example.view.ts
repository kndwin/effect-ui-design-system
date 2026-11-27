import { CodeBlock } from "@weft/components/code-block"
import { Collapsible } from "@weft/components/collapsible"
import { Center } from "@weft/components/layout/center"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { ExampleDef } from "./example.define.ts"
import { ExampleMessageSchema } from "./example.schema.ts"
import { examples } from "./registry.constant.ts"

export const view = ExampleDef.view((h, { codeOpen }) => {
  const example = examples.find((e) => e.id === h.props.id)!
  return Section(h.section, { surface: "card" }).children(
    Section(h.div, { pad: "3", divided: true }).children(
      Text(h.h3, { size: "sm", weight: "medium" }).children(example.title)
    ),
    Section(h.div, { surface: "base", pad: "6", gap: "4" }).children(
      Center(h.div).children(example.component(h, { key: example.id }))
    ),
    Section(h.div, { pad: "3", divided: true }).children(
      Collapsible(h, {
        key: `code-${example.id}`,
        open: codeOpen,
        onOpenChange: ({ open }) => ExampleMessageSchema.ToggledCode({ open }),
        trigger: "Code",
        fill: true,
        children: [CodeBlock(h, { code: example.source.trim(), title: example.file, key: `source-${example.id}` })]
      })
    )
  )
})
