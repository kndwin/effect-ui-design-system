import { Button } from "@acme/components"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Sizes"

export default Html.component({ name: "ButtonSizes", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    h.div.class("example-row").children(
      Button(h, { size: "sm", tone: "primary", children: "Small" }),
      Button(h, { size: "md", tone: "primary", children: "Medium" }),
      Button(h, { size: "sm", children: "Small" }),
      Button(h, { size: "md", children: "Medium" })
    )
})
