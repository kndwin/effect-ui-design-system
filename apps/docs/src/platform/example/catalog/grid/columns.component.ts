import { Grid, GridSpan } from "@weft/components/layout/grid"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Columns and spans"
export const order = 1

const cell = <Msg>(h: Html.H<Msg>, label: string) =>
  Section(h.div, { surface: "muted", pad: "3" }).children(Text(h.span, { size: "sm" }).children(label))

export default Html.component({ name: "GridColumns", model: Schema.Struct({}), message: Schema.Never }).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) =>
    Grid(h.div, { columns: "3", gap: "2", stack: true }).children(
      GridSpan(cell(h, "Spans two columns"), { span: "2" }),
      cell(h, "One"),
      cell(h, "Two"),
      cell(h, "Three"),
      cell(h, "Four")
    )
})
