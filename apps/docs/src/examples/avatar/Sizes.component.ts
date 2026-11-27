import { Avatar } from "@acme/components/avatar"
import { HStack } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Sizes and shapes"
export const order = 2

export default Html.component({ name: "AvatarSizes", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      Avatar(h, { name: "Ada Lovelace", size: "sm", key: "1" }),
      Avatar(h, { name: "Ada Lovelace", size: "md", key: "2" }),
      Avatar(h, { name: "Ada Lovelace", size: "lg", key: "3" }),
      Avatar(h, { name: "Grace Hopper", size: "sm", shape: "square", key: "4" }),
      Avatar(h, { name: "Grace Hopper", size: "md", shape: "square", key: "5" }),
      Avatar(h, { name: "Grace Hopper", size: "lg", shape: "square", key: "6" })
    )
})
