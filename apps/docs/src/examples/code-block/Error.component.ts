import { CodeBlock } from "@acme/components"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Destructive, wrapped"
export const order = 5

// The real message from a theme with a bad value.
const code = `Error: Theme "astryx" (dark) has invalid token values:
  Colors.accent: expected #hex, rgb(), hsl() or oklch() (got "purple")
    at Module.make (packages/ds/src/Theme.ts:51:9)`

export default Html.component({ name: "CodeBlockError", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    h.div
      .class("example-wide")
      .children(
        CodeBlock(h, { code, title: "vite build", tone: "destructive", language: "plain", wrap: true, key: "error" })
      )
})
