import { CodeBlock } from "@weft/components/code-block"
import { StackItem } from "@weft/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Diff"
export const order = 3

const code = `export const Colors = TokenColor.make("color", [
  "surface",
  "accent",
- "brand",
+ "accentFg",
+ "ring"
])`

export default Html.component({ name: "CodeBlockDiff", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    StackItem(h.div, { fill: true }).children(
      CodeBlock(h, { code, title: "tokens.ts", marks: { 4: "removed", 5: "added", 6: "added" }, key: "diff" })
    )
})
