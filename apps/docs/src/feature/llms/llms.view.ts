import { CodeBlock } from "@weft/components/code-block"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { llmsSections } from "./llms.constant.ts"

export const LlmsPage = <Msg>(h: Html.H<Msg>, index: string) => [
  ...llmsSections.map((section, i) =>
    VStack(h.section, { gap: "3" }).children(
      Heading(h, section.heading),
      ...Blocks(h, `llms-${i}`, section.blocks, false)
    )
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Today's llms.txt"),
    Text(h.p).children("Generated from these docs at build time, so it always matches the pages."),
    CodeBlock(h, { code: index, title: "llms.txt", language: "plain", collapsible: true, key: "llms-index" })
  )
]
