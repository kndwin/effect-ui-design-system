import { Section } from "@weft/components/layout/section"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import type { Input } from "@effect/ui/View"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { getStartedNotice, getStartedSteps } from "./get-started.constant.ts"

const Step = <Msg>(h: Html.H<Msg>, index: number, title: string, children: ReadonlyArray<Input<Msg>>) =>
  HStack(h.section, { gap: "4", align: "start" }).children(
    Section(h.span, { surface: "muted", pad: "1" })
      .attr("aria-hidden", "true")
      .attr("style", "min-width:2rem;text-align:center;border-radius:9999px")
      .children(Text(h.span, { size: "sm", weight: "semibold" }).children(String(index))),
    StackItem(VStack(h.div, { gap: "3" }), { grow: true })
      .attr("style", "min-width:0")
      .children(Text(h.h2, { size: "lg", weight: "semibold" }).children(title), ...children)
  )

export const GetStartedPage = <Msg>(h: Html.H<Msg>) => [
  ...Blocks(h, "notice", [getStartedNotice], false),
  ...getStartedSteps.map((step, index) =>
    Step(h, index + 1, step.heading, Blocks(h, `step-${index}`, step.blocks, true))
  )
]
