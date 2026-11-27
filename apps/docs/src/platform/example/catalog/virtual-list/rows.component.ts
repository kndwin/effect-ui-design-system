import { VirtualList } from "@weft/components/virtual-list"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Ten thousand rows"
export const order = 1

export default Html.component({
  name: "VirtualListRows",
  model: Schema.Struct({}),
  message: Schema.Never
}).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) => VirtualList(h, { label: "Rows", count: 10000, itemSize: 36, onItem: ({ index }) => `Row ${index + 1}` })
})
