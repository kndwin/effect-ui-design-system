import { CodeBlock } from "@acme/components"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Title and copy"
export const order = 1

const code = `import { Button } from "@acme/components"

Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })`

export default Html.component({ name: "CodeBlockBasic", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) => h.div.class("example-wide").children(CodeBlock(h, { code, title: "Save.ts", key: "basic" }))
})
