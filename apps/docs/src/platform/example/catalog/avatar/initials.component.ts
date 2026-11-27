import { Avatar } from "@weft/components/avatar"
import { HStack } from "@weft/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Initials and hue from the name"
export const order = 1

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus", "Margaret Hamilton"]

export default Html.component({ name: "AvatarInitials", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      ...people.map((name) => Avatar(h, { name, key: name }))
    )
})
