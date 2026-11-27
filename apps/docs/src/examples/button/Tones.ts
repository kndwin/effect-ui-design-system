import { Button } from "@acme/components"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Tones"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Pressed: {} })

export default Html.component({ name: "ButtonTones", model: Schema.Number, message: Msg }).make({
  init: () => 0,
  update: { Pressed: ($) => $.model + 1 },
  view: (h, presses) =>
    h.div
      .class("example-row")
      .children(
        Button(h, { tone: "primary", onPress: Msg.Pressed(), children: "Primary" }),
        Button(h, { tone: "neutral", onPress: Msg.Pressed(), children: "Neutral" }),
        Button(h, { tone: "danger", onPress: Msg.Pressed(), children: "Danger" }),
        h.span.class("example-note").children(`${presses} presses`)
      )
})
