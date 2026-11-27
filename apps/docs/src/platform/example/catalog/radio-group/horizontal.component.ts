import { RadioGroup } from "@acme/components/radio-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Horizontal"
export const order = 2

const sizes = ["S", "M", "L", "XL"].map((size) => ({ value: size, label: size }))
const Msg = UiSchema.TaggedEnum({ Picked: { value: Schema.String } })

export default Html.component({ name: "RadioGroupSizes", model: Schema.String, message: Msg }).make({
  init: () => "M",
  update: { Picked: (_, { value }) => value },
  view: (h, value) =>
    RadioGroup(h, {
      label: "Size",
      orientation: "horizontal",
      value,
      items: sizes,
      onPick: (event) => Msg.Picked({ value: event.value })
    })
})
