import { Avatar } from "@acme/components"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Initials and hue from the name"

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus", "Margaret Hamilton"]

export default Html.component({ name: "AvatarInitials", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) => h.div.class("example-row").children(...people.map((name) => Avatar(h, { name, key: name })))
})
