import { NumberField } from "@weft/components/number-field"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Quantity"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Updated: { value: Schema.NullOr(Schema.Number) } })

export default Html.component({
  name: "NumberFieldQuantity",
  model: Schema.Struct({ quantity: Schema.NullOr(Schema.Number) }),
  message: Msg
}).make({
  init: () => ({ quantity: 2 }),
  update: { Updated: ($, { value }) => $.evolve({ quantity: value }) },
  view: (h, { quantity }) =>
    NumberField(h, {
      label: "Quantity",
      value: quantity,
      min: 0,
      max: 99,
      onUpdate: ({ value }) => Msg.Updated({ value })
    })
})
