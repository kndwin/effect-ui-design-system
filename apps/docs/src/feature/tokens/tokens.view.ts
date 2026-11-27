import { Grid } from "@weft/components/layout/grid"
import { Section } from "@weft/components/layout/section"
import { HStack, VStack } from "@weft/components/layout/stack"
import { manifest } from "@weft/components/manifest"
import { Swatch } from "@weft/components/swatch"
import { Text } from "@weft/components/text"
import type { Html } from "@effect/ui/html"
import { Match, Record } from "effect"
import type { Vars } from "../../platform/theme/theme.schema.ts"
import { Heading } from "../../platform/ui/ui.view.ts"

export const TokensPage = <Msg>(h: Html.H<Msg>, vars: Vars) =>
  Record.toEntries(manifest.tokens).map(([group, tokenGroup]) =>
    VStack(h.section, { gap: "3" }).children(
      HStack(h.div, { gap: "3", align: "baseline", wrap: true }).children(
        Heading(h, group),
        Text(h.span, { mono: true, size: "xs", tone: "muted" }).children(tokenGroup.kind)
      ),
      Section(h.div, { surface: "card", pad: "4" }).children(
        Grid(h.div, { columns: "3", gap: "2" }).children(
          ...["Token", "CSS variable", "Value"].map((label) =>
            Text(h.div, { size: "xs", tone: "muted", weight: "medium", truncate: true }).children(label)
          ),
          ...tokenGroup.keys.flatMap((key) => {
            const name = `--${tokenGroup.prefix}-${key.replaceAll(".", "_")}`
            const value = vars[name] ?? ""
            return [
              Text(h.code, { mono: true, size: "xs", weight: "medium", truncate: true }).children(`${group}.${key}`),
              Text(h.code, { mono: true, size: "xs", tone: "muted", truncate: true }).children(name),
              HStack(h.div, { gap: "2" }).children(
                Match.value(tokenGroup.kind).pipe(
                  Match.when("Color", () => Swatch(h.span, { color: `var(${name})`, size: "sm" })),
                  Match.orElse(() => h.span)
                ),
                Text(h.code, { mono: true, size: "xs", tone: "muted", truncate: true })
                  .attr("title", value)
                  .children(value)
              )
            ]
          })
        )
      )
    )
  )
