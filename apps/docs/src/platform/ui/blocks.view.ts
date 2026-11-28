import { CodeBlock } from "@weft/components/code-block"
import { Grid } from "@weft/components/layout/grid"
import { Section } from "@weft/components/layout/section"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Match } from "effect"
import type { Block } from "../content/block.schema.ts"

export const Blocks = <Msg>(h: Html.H<Msg>, key: string, blocks: ReadonlyArray<Block>, compact: boolean) =>
  blocks.map((block, index) =>
    Match.value(block).pipe(
      Match.tag("Text", ({ text }) =>
        Match.value(compact).pipe(
          Match.when(true, () => Text(h.p, { size: "sm", tone: "muted" }).children(text)),
          Match.orElse(() => Text(h.p).children(text))
        )
      ),
      Match.tag("Notice", ({ text }) =>
        Section(h.div, { surface: "muted", pad: "4" }).children(Text(h.p, { size: "sm" }).children(text))
      ),
      Match.tag("Code", ({ code, title, language, lineNumbers, collapsible }) =>
        CodeBlock(h, { code, title, language, lineNumbers, collapsible, key: `${key}-${index}` })
      ),
      Match.tag("Cards", ({ cards }) =>
        Grid(h.div, { columns: "3", gap: "3", stack: true }).children(
          ...cards.map((card) =>
            Section(h.div, { surface: "card", pad: "4", gap: "2" }).children(
              Text(h.span, { mono: card.mono, weight: "semibold", size: "sm" }).children(card.title),
              Text(h.p, { size: "sm", tone: "muted" }).children(card.text)
            )
          )
        )
      ),
      Match.exhaustive
    )
  )
