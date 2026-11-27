import { CodeBlock } from "@weft/components/code-block"
import { StackItem } from "@weft/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "No title: the copy button floats"
export const order = 4

export default Html.component({ name: "CodeBlockTerminal", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    StackItem(h.div, { fill: true }).children(
      CodeBlock(h, {
        code: "pnpm add @weft/components @weft/theme-shadcn # then import the theme once",
        language: "shell",
        size: "sm",
        key: "shell"
      })
    )
})
