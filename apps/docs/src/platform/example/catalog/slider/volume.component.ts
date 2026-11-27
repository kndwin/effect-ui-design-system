import { VStack } from "@weft/components/layout/stack"
import { Slider } from "@weft/components/slider"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Volume"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Moved: { value: Schema.Number } })

export default Html.component({ name: "SliderVolume", model: Schema.Number, message: Msg }).make({
  init: () => 40,
  update: { Moved: (_, { value }) => value },
  view: (h, volume) =>
    VStack(h.div, { gap: "3" }).children(
      Text(h.span, { size: "sm", tone: "muted" }).children(`Volume: ${volume}`),
      Slider(h, { label: "Volume", value: volume, step: 5, onMove: ({ value }) => Msg.Moved({ value }) })
    )
})
