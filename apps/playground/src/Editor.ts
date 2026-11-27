import { Avatar, Button, Tone } from "@acme/components"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const EditorMessage = UiSchema.TaggedEnum({ PressedSave: {}, PressedDelete: {}, ToggledTheme: {}, ToggledMode: {} })

export const Editor = Html.component({
  name: "Editor",
  model: Schema.Struct({
    saving: Schema.Boolean,
    saveTone: Tone,
    theme: Schema.Literals(["acme", "astryx"]),
    mode: Schema.Literals(["light", "dark"])
  }),
  message: EditorMessage
}).make({
  init: () => ({ saving: false, saveTone: "primary", theme: "acme", mode: "light" }),
  update: {
    PressedSave: ($) => $.evolve({ saving: true }),
    PressedDelete: ($) => $.model,
    ToggledTheme: ($) => $.evolve({ theme: (t) => (t === "acme" ? "astryx" : "acme") }),
    ToggledMode: ($) => $.evolve({ mode: (m) => (m === "light" ? "dark" : "light") })
  },
  // Theme and mode are just attributes: the components never know which theme they're in.
  view: (h, model) =>
    h.div.attr("data-theme", model.theme).attr("data-mode", model.mode).class("stage").children(
      h.div.class("row").children(
        Avatar(h, { name: "Ada Lovelace" }),
        Avatar(h, { name: "Grace Hopper", shape: "square" }),
        Button(h, { tone: model.saveTone, loading: model.saving, onPress: EditorMessage.PressedSave(),
                    children: model.saving ? "Saving…" : "Save" }),
        Button(h, { tone: "danger", size: "sm", onPress: EditorMessage.PressedDelete(), children: "Delete" })
      ),
      h.div.class("row").children(
        Button(h, { onPress: EditorMessage.ToggledTheme(), children: `Theme: ${model.theme}` }),
        Button(h, { onPress: EditorMessage.ToggledMode(), children: `Mode: ${model.mode}` })
      )
    )
})
