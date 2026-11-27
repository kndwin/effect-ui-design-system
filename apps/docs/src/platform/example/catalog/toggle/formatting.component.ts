import { HStack } from "@acme/components/layout/stack"
import { Toggle } from "@acme/components/toggle"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Formatting toolbar"
export const order = 1

const Format = Schema.Literals(["bold", "italic", "underline"])
const Msg = UiSchema.TaggedEnum({ Toggled: { format: Format, pressed: Schema.Boolean } })
const formats = [
  ["bold", "B", "Bold"],
  ["italic", "I", "Italic"],
  ["underline", "U", "Underline"]
] as const

export default Html.component({
  name: "ToggleFormatting",
  model: Schema.Struct({ bold: Schema.Boolean, italic: Schema.Boolean, underline: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ bold: true, italic: false, underline: false }),
  update: { Toggled: ($, { format, pressed }) => ({ ...$.model, [format]: pressed }) },
  view: (h, model) =>
    HStack(h.div, { gap: "1" }).children(
      ...formats.map(([format, glyph, label]) =>
        Toggle(h, {
          size: "sm",
          label,
          pressed: model[format],
          onToggle: ({ pressed }) => Msg.Toggled({ format, pressed }),
          children: glyph
        })
      )
    )
})
