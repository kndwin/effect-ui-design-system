import { CodeBlock } from "@acme/components"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Line numbers and highlighted lines"
export const order = 2

const code = `export const ButtonStyle = Style.make(Button)({
  base: { root: { borderRadius: Radius.control } },
  variants: {
    tone: Variant.make(Tone, {
      primary: { root: { background: Colors.accent } },
      neutral: { root: { background: Colors.surface } },
      danger: { root: { background: Colors.danger } }
    })
  }
})`

export default Html.component({ name: "CodeBlockLineNumbers", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    h.div.class("example-wide").children(
      CodeBlock(h, {
        code,
        title: "button.css.ts",
        lineNumbers: true,
        startLine: 10,
        marks: { 14: "highlighted", 15: "highlighted", 16: "highlighted" },
        key: "numbers"
      })
    )
})
