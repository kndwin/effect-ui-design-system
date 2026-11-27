import { Button } from "@weft/components/button"
import { Dialog } from "@weft/components/dialog"
import { Field } from "@weft/components/field"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Edit profile"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  ChangedOpen: { open: Schema.Boolean },
  UpdatedName: { value: Schema.String },
  PressedSave: {}
})

export default Html.component({
  name: "DialogEditProfile",
  model: Schema.Struct({ open: Schema.Boolean, name: Schema.String, saved: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: false, name: "Ada Lovelace", saved: "Ada Lovelace" }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    UpdatedName: ($, { value }) => $.evolve({ name: value }),
    PressedSave: ($) => $.evolve({ open: false, saved: $.model.name })
  },
  view: (h, { open, name, saved }) =>
    VStack(h.div, { gap: "3", align: "center" }).children(
      Dialog(h, {
        open,
        onOpenChange: (event) => Msg.ChangedOpen({ open: event.open }),
        trigger: "Edit profile",
        title: "Edit profile",
        description: "Changes show on your public page.",
        children: [
          Field(h, { label: "Name", value: name, onUpdate: (event) => Msg.UpdatedName({ value: event.value }) })
        ],
        footer: [Button(h, { tone: "primary", onPress: Msg.PressedSave(), children: "Save" })]
      }),
      Text(h.span, { size: "sm", tone: "muted" }).children(`Saved name: ${saved}`)
    )
})
