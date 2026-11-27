import { Popover } from "@acme/components/popover"
import { Switch } from "@acme/components/switch"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Settings in a popover"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean }, ToggledCompact: { checked: Schema.Boolean } })

export default Html.component({
  name: "PopoverDetails",
  model: Schema.Struct({ open: Schema.Boolean, compact: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ open: false, compact: false }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    ToggledCompact: ($, { checked }) => $.evolve({ compact: checked })
  },
  view: (h, { open, compact }) =>
    Popover(h, {
      open,
      onOpenChange: (event) => Msg.ChangedOpen({ open: event.open }),
      trigger: "View options",
      title: "View",
      description: "Choose how dense the list is.",
      children: [
        Switch(h, {
          label: "Compact rows",
          checked: compact,
          onToggle: (event) => Msg.ToggledCompact({ checked: event.checked })
        })
      ]
    })
})
