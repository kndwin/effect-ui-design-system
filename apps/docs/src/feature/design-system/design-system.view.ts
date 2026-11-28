import { VStack } from "@weft/components/layout/stack"
import type { Html } from "@effect/ui/html"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { designSystemNotice, designSystemSections } from "./design-system.constant.ts"

export const DesignSystemPage = <Msg>(h: Html.H<Msg>) => [
  ...Blocks(h, "design-system-notice", [designSystemNotice], false),
  ...designSystemSections.map((section, index) =>
    VStack(h.section, { gap: "3" }).children(
      Heading(h, section.heading),
      ...Blocks(h, `design-system-${index}`, section.blocks, false)
    )
  )
]
