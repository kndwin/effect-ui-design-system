import { HStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Surfaces"
export const order = 1

const surfaces = ["base", "card", "muted"] as const

export default Html.component({ name: "SectionSurfaces", model: Schema.Struct({}), message: Schema.Never }).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) =>
    HStack(h.div, { gap: "3", wrap: true }).children(
      ...surfaces.map((surface) =>
        Section(h.div, { surface, pad: "4", gap: "1" }).children(
          Text(h.strong, { size: "sm", weight: "semibold" }).children(surface),
          Text(h.span, { size: "xs", tone: "muted" }).children(`surface: "${surface}"`)
        )
      )
    )
})
