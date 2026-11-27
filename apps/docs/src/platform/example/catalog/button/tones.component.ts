import { Button } from "@weft/components/button"
import { UiSchema } from "@effect/ui"
import { Text } from "@weft/components/text"
import { HStack } from "@weft/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Tones"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Pressed: {} })

export default Html.component({ name: "ButtonTones", model: Schema.Number, message: Msg }).make({
  init: () => 0,
  update: { Pressed: ($) => $.model + 1 },
  view: (h, presses) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      Button(h, { tone: "primary", onPress: Msg.Pressed(), children: "Primary" }),
      Button(h, { tone: "neutral", onPress: Msg.Pressed(), children: "Neutral" }),
      Button(h, { tone: "danger", onPress: Msg.Pressed(), children: "Danger" }),
      Text(h.span, { size: "sm", tone: "muted" }).children(`${presses} presses`)
    )
})
