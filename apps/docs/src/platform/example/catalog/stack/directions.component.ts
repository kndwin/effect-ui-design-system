import { Button } from "@weft/components/button"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Rows and columns"
export const order = 1

export default Html.component({ name: "StackDirections", model: Schema.Struct({}), message: Schema.Never }).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) =>
    VStack(h.div, { gap: "4" }).children(
      HStack(h.div, { gap: "2", align: "center" }).children(
        StackItem(Text(h.span, { weight: "medium" }), { grow: true }).children("HStack, the title grows"),
        Button(h, { size: "sm", tone: "ghost", children: "Cancel" }),
        Button(h, { size: "sm", tone: "primary", children: "Save" })
      ),
      VStack(h.div, { gap: "2" }).children(
        ...["One", "Two", "Three"].map((label) =>
          Section(h.div, { surface: "muted", pad: "3" }).children(
            Text(h.span, { size: "sm" }).children(`VStack · ${label}`)
          )
        )
      )
    )
})
