import { CodeBlock } from "@acme/components/code-block"
import { StackItem } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Title and copy"
export const order = 1

const code = `import { Button } from "@acme/components/button"

Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })`

export default Html.component({ name: "CodeBlockBasic", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) => StackItem(h.div, { fill: true }).children(CodeBlock(h, { code, title: "Save.ts", key: "basic" }))
})
