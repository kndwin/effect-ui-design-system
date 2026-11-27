import { Grid } from "@weft/components/layout/grid"
import { Section } from "@weft/components/layout/section"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Heading } from "../../platform/ui/ui.view.ts"

const Card = <Msg>(h: Html.H<Msg>, title: string, text: string, mono = false) =>
  Section(h.div, { surface: "card", pad: "4", gap: "2" }).children(
    Text(h.span, { mono, weight: "semibold", size: "sm" }).children(title),
    Text(h.p, { size: "sm", tone: "muted" }).children(text)
  )

export const IntroductionPage = <Msg>(h: Html.H<Msg>) => [
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Why Weft"),
    Text(h.p).children(
      "ui-kit gives you headless components: behaviour, focus and ARIA, with no look of their own. Weft is the thread woven through them. Every component is styled against a token contract, and a theme fills that contract in, so swapping the theme restyles everything without touching a component."
    ),
    Text(h.p).children(
      "Styles are plain TypeScript checked by the compiler, and compiled to static CSS at build time by Weft's own Effect CSS engine. There's no runtime styling and no class-name soup in your views."
    )
  ),
  VStack(h.section, { gap: "4" }).children(
    Heading(h, "What's inside"),
    Grid(h.div, { columns: "3", gap: "3", stack: true }).children(
      Card(h, "49 components", "Every ui-kit component with something to style, plus layout primitives and Text."),
      Card(h, "10 templates", "Whole pages built only from the components: dashboards, forms, inboxes, boards."),
      Card(h, "2 themes", "shadcn and astryx, each in light and dark, and a theme panel to make your own.")
    )
  ),
  VStack(h.section, { gap: "4" }).children(
    Heading(h, "How it fits together"),
    Grid(h.div, { columns: "3", gap: "3", stack: true }).children(
      Card(
        h,
        "@weft/design-system",
        "Token kinds, Theme, Variant and Style. Knows ui-kit's parts and data attributes.",
        true
      ),
      Card(h, "@weft/components", "The token contract (names only) and the components styled against it.", true),
      Card(h, "@weft/theme-*", "Values for every token, plus modes. shadcn and astryx ship here.", true)
    ),
    Text(h.p, { size: "sm", tone: "muted" }).children("Ready to build? Get started walks through a first app.")
  )
]
