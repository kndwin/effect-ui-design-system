import { Meter } from "@acme/components/meter"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Storage used"
export const order = 1

export default Html.component({
  name: "MeterStorage",
  model: Schema.Struct({}),
  message: Schema.Never
}).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) => Meter(h, { label: "Storage", value: 72, valueText: "7.2 of 10 GB" })
})
