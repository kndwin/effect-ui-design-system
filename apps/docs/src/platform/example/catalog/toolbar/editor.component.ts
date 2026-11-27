import { Toolbar } from "@weft/components/toolbar"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Editor toolbar"
export const order = 1

const Format = Schema.Literals(["bold", "italic", "underline"])
const Msg = UiSchema.TaggedEnum({ Toggled: { format: Format }, Pressed: { action: Schema.String } })

export default Html.component({
  name: "ToolbarEditor",
  model: Schema.Struct({ bold: Schema.Boolean, italic: Schema.Boolean, underline: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ bold: true, italic: false, underline: false }),
  update: {
    Toggled: ($, { format }) => ({ ...$.model, [format]: !$.model[format] }),
    Pressed: ($) => $.model
  },
  view: (h, model) =>
    Toolbar(h, {
      label: "Formatting",
      items: [
        { value: "bold", label: "Bold", glyph: "B", pressed: model.bold, onPress: Msg.Toggled({ format: "bold" }) },
        {
          value: "italic",
          label: "Italic",
          glyph: "I",
          pressed: model.italic,
          onPress: Msg.Toggled({ format: "italic" })
        },
        {
          value: "underline",
          label: "Underline",
          glyph: "U",
          pressed: model.underline,
          onPress: Msg.Toggled({ format: "underline" })
        },
        "separator",
        { value: "link", label: "Insert link", onPress: Msg.Pressed({ action: "link" }) },
        { value: "image", label: "Insert image", disabled: true, onPress: Msg.Pressed({ action: "image" }) }
      ]
    })
})
