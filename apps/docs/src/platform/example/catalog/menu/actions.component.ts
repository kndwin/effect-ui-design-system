import { VStack } from "@acme/components/layout/stack"
import { Menu } from "@acme/components/menu"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Actions"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean }, Picked: { value: Schema.String } })

export default Html.component({
  name: "MenuActions",
  model: Schema.Struct({ open: Schema.Boolean, last: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: false, last: "nothing" }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    Picked: ($, { value }) => $.evolve({ last: value })
  },
  view: (h, { open, last }) =>
    VStack(h.div, { gap: "3", align: "center" }).children(
      Menu(h, {
        open,
        onOpenChange: (event) => Msg.ChangedOpen({ open: event.open }),
        onPick: (event) => Msg.Picked({ value: event.value }),
        trigger: "Actions",
        items: [
          { value: "rename", label: "Rename" },
          { value: "duplicate", label: "Duplicate" },
          { value: "archive", label: "Archive", disabled: true },
          "separator",
          { value: "delete", label: "Delete", danger: true }
        ]
      }),
      Text(h.span, { size: "sm", tone: "muted" }).children(`Last picked: ${last}`)
    )
})
