import { Text } from "@weft/components/text"
import { PreviewCard } from "@weft/components/preview-card"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Link preview"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean } })

export default Html.component({
  name: "PreviewCardLink",
  model: Schema.Struct({ open: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ open: false }),
  update: { ChangedOpen: ($, { open }) => $.evolve({ open }) },
  view: (h, { open }) =>
    Text(h.p, { size: "sm" }).children(
      "Every color comes from the ",
      PreviewCard(h, {
        open,
        onOpenChange: (event) => Msg.ChangedOpen({ open: event.open }),
        trigger: "token contract",
        href: "#tokens",
        children: [
          Text(h.strong, {}).children("Token contract"),
          Text(h.p, { size: "sm", tone: "muted" }).children(
            "Typed CSS variables every theme fills in and every style reads."
          )
        ]
      }),
      ", so themes swap without touching components."
    )
})
