import { Avatar } from "@acme/components/avatar"
import { HStack } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Image, with initials until it loads"
export const order = 3

// A stand-in photo, inlined so the example works offline.
const photo =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#f6a75b"/><stop offset="1" stop-color="#c2417a"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="25" r="11" fill="#fff8"/><path d="M10 64c2-14 11-21 22-21s20 7 22 21z" fill="#fff8"/></svg>`
  )

export default Html.component({ name: "AvatarImage", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      Avatar(h, { name: "Ada Lovelace", src: photo, size: "lg", key: "loaded" }),
      // A broken source falls back to initials; the root says data-status="error".
      Avatar(h, { name: "Grace Hopper", src: "/missing.png", size: "lg", key: "broken" })
    )
})
