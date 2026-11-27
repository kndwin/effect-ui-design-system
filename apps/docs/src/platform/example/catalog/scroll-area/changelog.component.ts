import { ScrollArea } from "@acme/components/scroll-area"
import { Text } from "@acme/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "A long list"
export const order = 1

const releases = Array.from({ length: 30 }, (_, index) => `v0.${30 - index}.0`)

export default Html.component({ name: "ScrollAreaChangelog", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    ScrollArea(h, {
      label: "Releases",
      children: releases.map((release) =>
        Text(h.p, { size: "sm" }).children(`${release}: fixes and small improvements`)
      )
    })
})
