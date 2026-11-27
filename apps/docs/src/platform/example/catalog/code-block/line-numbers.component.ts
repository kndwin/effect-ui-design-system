import { CodeBlock } from "@acme/components/code-block"
import { StackItem } from "@acme/components/layout/stack"
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
    StackItem(h.div, { fill: true }).children(
      CodeBlock(h, {
        code,
        title: "button.component.style.ts",
        lineNumbers: true,
        startLine: 10,
        marks: { 14: "highlighted", 15: "highlighted", 16: "highlighted" },
        key: "numbers"
      })
    )
})
