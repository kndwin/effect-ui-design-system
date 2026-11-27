import { Center } from "@weft/components/layout/center"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Centred content"
export const order = 1

export default Html.component({ name: "CenterCard", model: Schema.Struct({}), message: Schema.Never }).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) =>
    Section(h.div, { surface: "muted", pad: "6" }).children(
      Center(h.div).children(
        Section(h.div, { surface: "card", pad: "4" }).children(
          Text(h.span, { size: "sm" }).children("Always in the middle")
        )
      )
    )
})
