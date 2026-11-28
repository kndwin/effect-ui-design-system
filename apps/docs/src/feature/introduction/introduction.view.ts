import { VStack } from "@weft/components/layout/stack"
import type { Html } from "@effect/ui/html"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { introductionSections } from "./introduction.constant.ts"

export const IntroductionPage = <Msg>(h: Html.H<Msg>) =>
  introductionSections.map((section, index) =>
    VStack(h.section, { gap: "3" }).children(
      Heading(h, section.heading),
      ...Blocks(h, `introduction-${index}`, section.blocks, false)
    )
  )
