import { Drawer } from "@weft/components/drawer"
import { HStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "From the right and the bottom"
export const order = 1

const Side = Schema.Literals(["right", "bottom"])
const Msg = UiSchema.TaggedEnum({ ChangedOpen: { side: Side, open: Schema.Boolean } })

export default Html.component({
  name: "DrawerSides",
  model: Schema.Struct({ right: Schema.Boolean, bottom: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ right: false, bottom: false }),
  update: { ChangedOpen: ($, { side, open }) => ({ ...$.model, [side]: open }) },
  view: (h, model) =>
    HStack(h.div, { gap: "3", justify: "center" }).children(
      ...Side.literals.map((side) =>
        Drawer(h, {
          key: side,
          side,
          open: model[side],
          onOpenChange: (event) => Msg.ChangedOpen({ side, open: event.open }),
          trigger: `Open ${side}`,
          title: "Filters",
          description: "Swipe it away, press Escape or use the button.",
          children: [Text(h.p, { size: "sm" }).children("Anything can go here: a form, a list, a cart.")]
        })
      )
    )
})
