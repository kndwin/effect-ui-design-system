import { CodeBlock } from "@acme/components"
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
    h.div
      .class("example-wide")
      .children(
        CodeBlock(h, { code, title: "tokens.ts", marks: { 4: "removed", 5: "added", 6: "added" }, key: "diff" })
      )
})
