import { AlertDialog } from "@acme/components/alert-dialog"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Confirm a delete"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean }, PressedDelete: {} })

export default Html.component({
  name: "AlertDialogDelete",
  model: Schema.Struct({ open: Schema.Boolean, deleted: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ open: false, deleted: false }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    PressedDelete: ($) => $.evolve({ open: false, deleted: true })
  },
  view: (h, { open, deleted }) =>
    VStack(h.div, { gap: "3", align: "center" }).children(
      AlertDialog(h, {
        open,
        onOpenChange: (event) => Msg.ChangedOpen({ open: event.open }),
        trigger: "Delete project",
        title: "Delete this project?",
        description: "Its pages, history and settings go with it. You can't undo this.",
        confirm: "Delete",
        onConfirm: Msg.PressedDelete()
      }),
      Text(h.span, { size: "sm", tone: "muted" }).children(
        Match.value(deleted).pipe(
          Match.when(true, () => "Deleted."),
          Match.orElse(() => "Nothing deleted yet.")
        )
      )
    )
})
