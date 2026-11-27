import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { Button, Tone } from "@cave/ds"

export const EditorMessage = UiSchema.TaggedEnum({ PressedSave: {}, PressedDelete: {}, ToggledTheme: {} })

export const Editor = Html.component({
  name: "Editor",
  model: Schema.Struct({ saving: Schema.Boolean, saveTone: Tone, theme: Schema.Literals(["dark", "light"]) }),
  message: EditorMessage
}).make({
  init: () => ({ saving: false, saveTone: "primary", theme: "dark" }),
  update: {
    PressedSave: ($) => $.evolve({ saving: true }),
    PressedDelete: ($) => $.model,
    ToggledTheme: ($) => $.evolve({ theme: (t) => (t === "dark" ? "light" : "dark") })
  },
  view: (h, model) =>
    h.div.attr("data-theme", model.theme).children(
      Button(h, {
        tone: model.saveTone,
        loading: model.saving,
        onPress: EditorMessage.PressedSave(),
        children: model.saving ? "Saving…" : "Save"
      }),
      Button(h, { tone: "danger", size: "sm", onPress: EditorMessage.PressedDelete(), children: "Delete" }),
      Button(h, { onPress: EditorMessage.ToggledTheme(), children: `Theme: ${model.theme}` })
    )
})
