import { Button, DS } from "@acme/components"
import { acme } from "@acme/theme-acme"
import { astryx } from "@acme/theme-astryx"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { type Example, examples } from "./registry.ts"

const themes = [acme, astryx] as const
const modes = ["light", "dark"] as const
const order = ["button", "avatar"]
const pages = [...new Set(examples.map((e) => e.page))].sort((a, b) => order.indexOf(a) - order.indexOf(b)).concat("tokens")
const label = (page: string) => page[0]!.toUpperCase() + page.slice(1)

const Msg = UiSchema.TaggedEnum({
  Navigated: { page: Schema.String },
  PickedTheme: { theme: Schema.String },
  ToggledMode: {},
  ToggledCompare: {}
})

const Model = Schema.Struct({
  page: Schema.String,
  theme: Schema.String,
  mode: Schema.Literals(modes),
  compare: Schema.Boolean
})
type Model = typeof Model.Type

export const Docs = Html.component({ name: "Docs", model: Model, message: Msg }).make({
  init: () => ({ page: pages[0]!, theme: "acme", mode: "light", compare: false }),
  update: {
    Navigated: ($, { page }) => $.evolve({ page }),
    PickedTheme: ($, { theme }) => $.evolve({ theme }),
    ToggledMode: ($) => $.evolve({ mode: (m) => (m === "light" ? "dark" : "light") }),
    ToggledCompare: ($) => $.evolve({ compare: (c) => !c })
  },
  // The docs chrome is itself themed: it sits inside the same data-theme / data-mode.
  view: (h, model) =>
    h.div.class("docs").attr("data-theme", model.theme).attr("data-mode", model.mode).children(
      h.header.class("docs-header").children(
        h.strong.children("Acme components"),
        h.div.class("docs-controls").children(
          ...themes.map((t) =>
            Button(h, {
              size: "sm",
              tone: model.theme === t.name ? "primary" : "neutral",
              onPress: Msg.PickedTheme({ theme: t.name }),
              children: t.name
            })
          ),
          Button(h, { size: "sm", onPress: Msg.ToggledMode(), children: model.mode === "light" ? "Light" : "Dark" }),
          Button(h, {
            size: "sm",
            tone: model.compare ? "primary" : "neutral",
            onPress: Msg.ToggledCompare(),
            children: "Compare themes"
          })
        )
      ),
      h.div.class("docs-body").children(
        h.nav.class("docs-nav").children(
          ...pages.map((page) =>
            h.button
              .class("docs-link", page === model.page && "docs-link-active")
              .on("click", Msg.Navigated({ page }))
              .children(label(page))
          )
        ),
        h.main.class("docs-main").children(...(model.page === "tokens" ? tokensPage(h) : componentPage(h, model)))
      )
    )
})

const componentPage = (h: Html.H<typeof Msg.Type>, model: Model) => {
  const info = DS.manifest.components.find((c) => c.kit.toLowerCase() === model.page)
  return [
    h.h1.children(label(model.page)),
    info
      ? h.table.class("docs-table").children(
        h.thead.children(h.tr.children(h.th.children("Variant"), h.th.children("Values"), h.th.children("Default"))),
        h.tbody.children(
          ...Object.entries(info.variants).map(([name, v]) =>
            h.tr.children(
              h.td.children(h.code.children(name)),
              h.td.children(v.values.join(" · ")),
              h.td.children(v.default === undefined ? "derived" : String(v.default))
            )
          ),
          h.tr.children(h.td.children(h.code.children("slots")), h.td.children(info.slots.join(" · ")), h.td.children(""))
        )
      )
      : h.span,
    ...examples.filter((e) => e.page === model.page).map((e) => exampleCard(h, e, model))
  ]
}

const exampleCard = (h: Html.H<typeof Msg.Type>, example: Example, model: Model) => {
  const frames = model.compare
    ? themes.flatMap((t) => modes.map((mode) => ({ theme: t.name, mode })))
    : [{ theme: model.theme, mode: model.mode }]
  return h.section.class("docs-card").children(
    h.h2.children(example.title),
    h.div.class(model.compare ? "docs-previews docs-previews-grid" : "docs-previews").children(
      ...frames.map((f) =>
        h.div.class("docs-preview").attr("data-theme", f.theme).attr("data-mode", f.mode).children(
          model.compare ? h.span.class("docs-preview-label").children(`${f.theme} · ${f.mode}`) : h.span,
          example.component(h, { key: `${example.id}:${f.theme}:${f.mode}` })
        )
      )
    ),
    h.pre.class("docs-code").children(h.code.children(example.source.trim()))
  )
}

const tokensPage = (h: Html.H<typeof Msg.Type>) => [
  h.h1.children("Tokens"),
  h.p.children(
    "The contract lives in @acme/components (names and kinds only). Each theme fills in every key; modes override a subset."
  ),
  ...Object.entries(DS.manifest.tokens).map(([group, t]) =>
    h.section.class("docs-card").children(
      h.h2.children(`${group} `, h.small.children(`${t.kind} · --${t.prefix}-*`)),
      h.table.class("docs-table").children(
        h.thead.children(
          h.tr.children(
            h.th.children("Token"),
            ...themes.flatMap((th) => modes.map((m) => h.th.children(`${th.name} ${m}`)))
          )
        ),
        h.tbody.children(
          ...t.keys.map((key) => {
            const name = `--${t.prefix}-${key.replaceAll(".", "_")}`
            return h.tr.children(
              h.td.children(h.code.children(`${group}.${key}`)),
              ...themes.flatMap((th) =>
                modes.map((m) => {
                  const value = (m === "dark" ? th.vars.modes.dark?.[name] : undefined) ?? th.vars.base[name] ?? ""
                  return h.td.children(
                    t.kind === "Color" ? h.span.class("docs-swatch").attr("style", `background:${value}`) : h.span,
                    h.code.children(value)
                  )
                })
              )
            )
          })
        )
      )
    )
  )
]
