import { CodeBlock } from "@acme/components/code-block"
import { StackItem } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Destructive, wrapped"
export const order = 5

const code = `Error: Theme "astryx" (dark) has invalid token values:
  Colors.accent: expected #hex, rgb(), hsl() or oklch() (got "purple")
    at Module.make (packages/ds/src/Theme.ts:51:9)`

export default Html.component({ name: "CodeBlockError", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    StackItem(h.div, { fill: true }).children(
      CodeBlock(h, { code, title: "vite build", tone: "destructive", language: "plain", wrap: true, key: "error" })
    )
})
