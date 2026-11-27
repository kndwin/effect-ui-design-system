import { CodeBlock } from "@weft/components/code-block"
import { Grid } from "@weft/components/layout/grid"
import { Section } from "@weft/components/layout/section"
import { HStack, VStack } from "@weft/components/layout/stack"
import { manifest } from "@weft/components/manifest"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Match, Record } from "effect"
import type { Page } from "../../platform/content/content.schema.ts"
import { ExampleBlock } from "../../platform/example/example.component.ts"
import { examples } from "../../platform/example/registry.constant.ts"
import type { Look } from "../../platform/theme/theme.schema.ts"
import { Heading, InlineCode, Pill } from "../../platform/ui/ui.view.ts"

export const ComponentDocsPage = <Msg>(h: Html.H<Msg>, page: Page, look: Look) => [
  VStack(h.section, { gap: "4" }).children(
    Heading(h, "Examples"),
    ...examples.filter((e) => e.page === page.id).map((e) => ExampleBlock(h, { id: e.id, ...look }))
  ),
  Match.value(manifest.components.find((c) => c.kit === page.kit)).pipe(
    Match.when(undefined, () => h.span),
    Match.orElse((kit) =>
      VStack(h.section, { gap: "3" }).children(
        Heading(h, "API"),
        Section(h.div, { surface: "card", pad: "4" }).children(
          Grid(h.div, { columns: "3", gap: "3" }).children(
            ...["Variant", "Values", "Default"].map((title) =>
              Text(h.div, { size: "xs", tone: "muted", weight: "medium" }).children(title)
            ),
            ...Record.toEntries(kit.variants).flatMap(([name, variant]) => [
              Text(h.code, { mono: true, size: "sm", weight: "medium" }).children(name),
              HStack(h.div, { gap: "1", wrap: true }).children(...variant.values.map((value) => Pill(h, value))),
              Match.value(variant.default).pipe(
                Match.when(undefined, () => Text(h.em, { size: "sm", tone: "muted" }).children("derived")),
                Match.orElse((value) => InlineCode(h, String(value)))
              )
            ])
          )
        ),
        Text(h.p, { size: "sm", tone: "muted" }).children(`Slots: ${kit.slots.join(", ")}`)
      )
    )
  ),
  Match.value(page.style).pipe(
    Match.when(undefined, () => h.span),
    Match.orElse((style) =>
      VStack(h.section, { gap: "3" }).children(
        Heading(h, "Styles"),
        Text(h.p).children(
          "The whole component's look is this file. It only references the token contract. Copy its folder into src/components/ui to own it; Get started shows how."
        ),
        CodeBlock(h, { code: style, title: page.styleFile, lineNumbers: true, key: `style-${page.id}` })
      )
    )
  )
]
