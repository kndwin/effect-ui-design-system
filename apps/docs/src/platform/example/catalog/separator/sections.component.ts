import { HStack, VStack } from "@weft/components/layout/stack"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Horizontal and vertical"
export const order = 1

export default Html.component({ name: "SeparatorSections", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    VStack(h.div, { gap: "3" }).children(
      Text(h.strong, { weight: "semibold" }).children("weft"),
      Text(h.span, { size: "sm", tone: "muted" }).children("Typed styles for @effect/ui-kit."),
      Separator(h),
      HStack(h.div, { gap: "3" }).children(
        Text(h.span, { size: "sm" }).children("Docs"),
        Separator(h, { orientation: "vertical" }),
        Text(h.span, { size: "sm" }).children("Themes"),
        Separator(h, { orientation: "vertical" }),
        Text(h.span, { size: "sm" }).children("GitHub")
      )
    )
})
