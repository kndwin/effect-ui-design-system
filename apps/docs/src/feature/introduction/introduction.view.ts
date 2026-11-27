import { CodeBlock } from "@acme/components/code-block"
import { Grid } from "@acme/components/layout/grid"
import { Section } from "@acme/components/layout/section"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import type { Html } from "@effect/ui/html"
import { install, installCommand } from "../../platform/content/content.constant.ts"
import { ExampleBlock } from "../../platform/example/example.component.ts"
import { examples } from "../../platform/example/registry.constant.ts"
import type { Look } from "../../platform/theme/theme.schema.ts"
import { Heading } from "../../platform/ui/ui.view.ts"

const PackageCard = <Msg>(h: Html.H<Msg>, name: string, text: string) =>
  Section(h.div, { surface: "card", pad: "4", gap: "2" }).children(
    Text(h.code, { mono: true, weight: "semibold", size: "sm" }).children(name),
    Text(h.p, { size: "sm", tone: "muted" }).children(text)
  )

export const IntroductionPage = <Msg>(h: Html.H<Msg>, look: Look) => [
  ...examples
    .filter((e) => e.page === "introduction")
    .map((e) => ExampleBlock(h, { id: e.id, initialTab: "themes", ...look })),
  VStack(h.section, { gap: "4" }).children(
    Heading(h, "How it fits together"),
    Grid(h.div, { columns: "3", gap: "3", stack: true }).children(
      PackageCard(
        h,
        "@acme/design-system",
        "Token kinds, Theme, Variant, Style. Knows ui-kit's parts and data attributes."
      ),
      PackageCard(h, "@acme/components", "The token contract (names only) and the components styled against it."),
      PackageCard(h, "@acme/theme-*", "Values for every token, plus modes. shadcn and astryx ship here.")
    )
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Usage"),
    CodeBlock(h, { code: installCommand, language: "shell", key: "install" }),
    CodeBlock(h, { code: install, title: "main.ts", key: "usage" })
  )
]
