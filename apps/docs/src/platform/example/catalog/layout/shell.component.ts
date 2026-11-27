import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from "@weft/components/layout/layout"
import { Text } from "@weft/components/text"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "App shell"
export const order = 1

export default Html.component({ name: "LayoutShell", model: Schema.Struct({}), message: Schema.Never }).make({
  init: () => ({}),
  update: ($) => $.model,
  view: (h) =>
    Layout(h.div)
      .attr("style", "min-height:16rem;width:100%")
      .children(
        LayoutHeader(h.header).children(Text(h.span, { weight: "semibold" }).children("Header")),
        LayoutPanel(h.nav, { side: "start" }).children(
          Text(h.span, { size: "sm", tone: "muted" }).children("Start panel")
        ),
        LayoutContent(h.main).children(Text(h.span, { size: "sm" }).children("Content")),
        LayoutFooter(h.footer).children(Text(h.span, { size: "xs", tone: "muted" }).children("Footer"))
      )
})
