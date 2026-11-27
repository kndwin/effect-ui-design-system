import { Grid } from "@acme/components/layout/grid"
import { Section } from "@acme/components/layout/section"
import { HStack, VStack } from "@acme/components/layout/stack"
import { manifest } from "@acme/components/manifest"
import { Swatch } from "@acme/components/swatch"
import { Text } from "@acme/components/text"
import type { Html } from "@effect/ui/html"
import { Match, Record } from "effect"
import { getThemeVars } from "../../platform/theme/theme.pure.ts"
import { ModeSchema } from "../../platform/theme/theme.schema.ts"
import { themes } from "../../platform/theme/themes.constant.ts"
import { Heading } from "../../platform/ui/ui.view.ts"

export const TokensPage = <Msg>(h: Html.H<Msg>) =>
  Record.toEntries(manifest.tokens).map(([group, tokenGroup]) =>
    VStack(h.section, { gap: "3" }).children(
      HStack(h.div, { gap: "3", align: "baseline", wrap: true }).children(
        Heading(h, group),
        Text(h.span, { mono: true, size: "xs", tone: "muted" }).children(
          `${tokenGroup.kind} · --${tokenGroup.prefix}-*`
        )
      ),
      Section(h.div, { surface: "card", pad: "4" }).children(
        Grid(h.div, { columns: "5", gap: "2" }).children(
          ...["Token", ...themes.flatMap((theme) => ModeSchema.literals.map((mode) => `${theme.name} · ${mode}`))].map(
            (label) => Text(h.div, { size: "xs", tone: "muted", weight: "medium", truncate: true }).children(label)
          ),
          ...tokenGroup.keys.flatMap((key) => {
            const name = `--${tokenGroup.prefix}-${key.replaceAll(".", "_")}`
            return [
              Text(h.code, { mono: true, size: "xs", weight: "medium", truncate: true }).children(`${group}.${key}`),
              ...themes.flatMap((theme) =>
                ModeSchema.literals.map((mode) => {
                  const value = getThemeVars({ theme, mode })[name] ?? ""
                  return HStack(h.div, { gap: "2" }).children(
                    Match.value(tokenGroup.kind).pipe(
                      Match.when("Color", () => Swatch(h.span, { color: value, size: "sm" })),
                      Match.orElse(() => h.span)
                    ),
                    Text(h.code, { mono: true, size: "xs", tone: "muted", truncate: true })
                      .attr("title", value)
                      .children(value)
                  )
                })
              )
            ]
          })
        )
      )
    )
  )
