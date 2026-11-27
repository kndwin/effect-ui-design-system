import { ToggleGroup } from "@weft/components/toggle-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Text alignment"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Toggled: { value: Schema.Array(Schema.String) } })

export default Html.component({
  name: "ToggleGroupAlignment",
  model: Schema.Struct({ value: Schema.Array(Schema.String) }),
  message: Msg
}).make({
  init: () => ({ value: ["left"] }),
  update: { Toggled: ($, { value }) => $.evolve({ value }) },
  view: (h, { value }) =>
    ToggleGroup(h, {
      size: "sm",
      label: "Text alignment",
      items: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ],
      value,
      onToggle: (event) => Msg.Toggled({ value: event.value })
    })
})
