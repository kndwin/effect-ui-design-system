import { HStack } from "@weft/components/layout/stack"
import { Tooltip } from "@weft/components/tooltip"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Icon buttons with tooltips"
export const order = 1

const tools = [
  ["undo", "↶", "Undo"],
  ["redo", "↷", "Redo"],
  ["print", "⎙", "Print"]
] as const
const Msg = UiSchema.TaggedEnum({ ChangedTip: { tip: Schema.NullOr(Schema.String) } })

export default Html.component({ name: "TooltipToolbar", model: Schema.NullOr(Schema.String), message: Msg }).make({
  init: () => null,
  update: { ChangedTip: (_, { tip }) => tip },
  view: (h, tip) =>
    HStack(h.div, { gap: "1", justify: "center" }).children(
      ...tools.map(([id, glyph, label]) =>
        Tooltip(h, {
          key: id,
          open: tip === id,
          onOpenChange: (event) =>
            Msg.ChangedTip({
              tip: Match.value(event.open).pipe(
                Match.when(true, () => id),
                Match.orElse(() => null)
              )
            }),
          label,
          trigger: glyph,
          content: label
        })
      )
    )
})
