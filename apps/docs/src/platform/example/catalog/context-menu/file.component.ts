import { ContextMenu } from "@acme/components/context-menu"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Right-click a file"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean }, Picked: { value: Schema.String } })

export default Html.component({
  name: "ContextMenuFile",
  model: Schema.Struct({ open: Schema.Boolean, last: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: false, last: "Nothing yet." }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    Picked: ($, { value }) => $.evolve({ last: `Picked ${value}.` })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      ContextMenu(h, {
        open: model.open,
        onOpenChange: ({ open }) => Msg.ChangedOpen({ open }),
        onPick: ({ value }) => Msg.Picked({ value }),
        items: [
          { value: "open", label: "Open" },
          { value: "rename", label: "Rename" },
          "separator",
          { value: "delete", label: "Delete", danger: true }
        ],
        children: "Right-click report.pdf"
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(model.last)
    )
})
