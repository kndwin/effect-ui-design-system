import { Collapsible } from "@weft/components/collapsible"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Shipping details"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Changed: { open: Schema.Boolean } })

export default Html.component({ name: "CollapsibleShipping", model: Schema.Boolean, message: Msg }).make({
  init: () => false,
  update: { Changed: (_, { open }) => open },
  view: (h, open) =>
    Collapsible(h, {
      open,
      onOpenChange: (event) => Msg.Changed({ open: event.open }),
      trigger: "Shipping details",
      children: [Text(h.p).children("Standard shipping takes 3 to 5 working days. Express arrives the next day.")]
    })
})
