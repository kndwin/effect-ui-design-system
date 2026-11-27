import { Button } from "@acme/components/button"
import { HStack } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Sizes"
export const order = 2

export default Html.component({ name: "ButtonSizes", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      Button(h, { size: "sm", tone: "primary", children: "Small" }),
      Button(h, { size: "md", tone: "primary", children: "Medium" }),
      Button(h, { size: "sm", children: "Small" }),
      Button(h, { size: "md", children: "Medium" })
    )
})
