import { Button, DS } from "@acme/components"
import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { install, type Page, pages, sources } from "./content.ts"
import { highlight } from "./highlight.ts"
import { type Example, examples } from "./registry.ts"

const themes = [shadcn, astryx] as const
const modes = ["light", "dark"] as const
const Tab = Schema.Literals(["preview", "code", "themes"])
type Tab = typeof Tab.Type

const Msg = UiSchema.TaggedEnum({
  Navigated: { page: Schema.String },
  PickedTheme: { theme: Schema.String },
  ToggledMode: {},
  PickedTab: { id: Schema.String, tab: Tab }
})
type H = Html.H<typeof Msg.Type>

const Model = Schema.Struct({
  page: Schema.String,
  theme: Schema.String,
  mode: Schema.Literals(modes),
  tabs: Schema.Record(Schema.String, Tab)
})
type Model = typeof Model.Type

export const Docs = Html.component({ name: "Docs", model: Model, message: Msg }).make({
  init: () => ({ page: "introduction", theme: "shadcn", mode: "light", tabs: {} }),
  update: {
    Navigated: ($, { page }) => $.evolve({ page }),
    PickedTheme: ($, { theme }) => $.evolve({ theme }),
    ToggledMode: ($) => $.evolve({ mode: (m) => (m === "light" ? "dark" : "light") }),
    PickedTab: ($, { id, tab }) => $.evolve({ tabs: (tabs) => ({ ...tabs, [id]: tab }) })
  },
  // The docs chrome sits inside the same data-theme / data-mode as the examples,
  // and reads the same contract variables, so it re-themes with them.
  view: (h, model) => {
    const page = pages.find((p) => p.id === model.page) ?? pages[0]!
    return h.div
      .class("docs")
      .attr("data-theme", model.theme)
      .attr("data-mode", model.mode)
      .children(
        header(h, model),
        h.div
          .class("docs-shell")
          .children(
            sidebar(h, page),
            h.main
              .class("docs-main")
              .children(
                h.div.class("docs-eyebrow").children(page.section),
                h.h1.children(page.title),
                h.p.class("docs-lead").children(page.lead),
                ...body(h, model, page),
                pager(h, page)
              )
          )
      )
  }
})

// ─── chrome ────────────────────────────────────────────────────────────────

const header = (h: H, model: Model) =>
  h.header.class("docs-header").children(
    h.button
      .class("docs-brand")
      .on("click", Msg.Navigated({ page: "introduction" }))
      .children(h.span.class("docs-brand-mark").children("◆"), h.span.children("acme/ui")),
    h.div.class("docs-header-controls").children(
      h.div
        .class("docs-segmented")
        .attr("role", "group")
        .attr("aria-label", "Theme")
        .children(
          ...themes.map((t) =>
            h.button
              .class("docs-segment", model.theme === t.name && "docs-segment-active")
              .attr("aria-pressed", model.theme === t.name ? "true" : "false")
              .on("click", Msg.PickedTheme({ theme: t.name }))
              .children(t.name)
          )
        ),
      Button(h, {
        size: "sm",
        onPress: Msg.ToggledMode(),
        class: "docs-icon-button",
        children: model.mode === "light" ? "☾" : "☀"
      }),
      h.a
        .class("docs-header-link")
        .attr("href", "https://github.com/kndwin/effect-ui-design-system")
        .attr("target", "_blank")
        .children("GitHub")
    )
  )

const sidebar = (h: H, current: Page) => {
  const sections = [...new Set(pages.map((p) => p.section))]
  return h.nav.class("docs-nav").children(
    ...sections.map((section) =>
      h.div.class("docs-nav-section").children(
        h.div.class("docs-nav-heading").children(section),
        ...pages
          .filter((p) => p.section === section)
          .map((p) =>
            h.button
              .class("docs-nav-link", p.id === current.id && "docs-nav-link-active")
              .on("click", Msg.Navigated({ page: p.id }))
              .children(p.title)
          )
      )
    )
  )
}

const pager = (h: H, page: Page) => {
  const i = pages.indexOf(page)
  const prev = pages[i - 1]
  const next = pages[i + 1]
  return h.div.class("docs-pager").children(
    prev
      ? h.button
          .class("docs-pager-link")
          .on("click", Msg.Navigated({ page: prev.id }))
          .children(h.small.children("Previous"), h.span.children(`← ${prev.title}`))
      : h.span,
    next
      ? h.button
          .class("docs-pager-link", "docs-pager-next")
          .on("click", Msg.Navigated({ page: next.id }))
          .children(h.small.children("Next"), h.span.children(`${next.title} →`))
      : h.span
  )
}

// ─── pages ─────────────────────────────────────────────────────────────────

const body = (h: H, model: Model, page: Page) => {
  switch (page.id) {
    case "introduction":
      return [
        ...examples.filter((e) => e.page === "introduction").map((e) => exampleBlock(h, e, model, "themes")),
        h.h2.children("How it fits together"),
        h.div
          .class("docs-stack")
          .children(
            stackCard(h, "@acme/ds", "Token kinds, Theme, Variant, Style. Knows ui-kit's parts and data attributes."),
            stackCard(h, "@acme/components", "The token contract (names only) and the components styled against it."),
            stackCard(h, "@acme/theme-*", "Values for every token, plus modes. shadcn and astryx ship here.")
          ),
        h.h2.children("Usage"),
        code(h, install)
      ]
    case "theming":
      return [
        h.h2.children("The contract"),
        h.p.children(
          "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected."
        ),
        code(h, sources.contract),
        h.h2.children("A theme"),
        h.p.children(
          'Theme.make won\'t compile unless every key is filled in. Values are decoded at build time, so "purple" for a colour fails vite build with the theme, mode and path.'
        ),
        ...themes.map((t) =>
          h.details
            .class("docs-details")
            .attr("open", t.name === model.theme ? "" : undefined)
            .children(h.summary.children(`@acme/theme-${t.name}`), code(h, sources.themes[t.name]))
        )
      ]
    case "tokens":
      return tokens(h)
    default:
      return component(h, model, page)
  }
}

const stackCard = (h: H, name: string, text: string) =>
  h.div.class("docs-stack-card").children(h.code.children(name), h.p.children(text))

const component = (h: H, model: Model, page: Page) => {
  const info = DS.manifest.components.find((c) => c.kit === page.kit)
  return [
    h.h2.children("Examples"),
    ...examples.filter((e) => e.page === page.id).map((e) => exampleBlock(h, e, model, "preview")),
    h.h2.children("API"),
    info
      ? h.div
          .class("docs-table-wrap")
          .children(
            h.table
              .class("docs-table")
              .children(
                h.thead.children(
                  h.tr.children(h.th.children("Prop"), h.th.children("Values"), h.th.children("Default"))
                ),
                h.tbody.children(
                  ...Object.entries(info.variants).map(([name, v]) =>
                    h.tr.children(
                      h.td.children(h.code.class("docs-prop").children(name)),
                      h.td.children(...v.values.map((value) => h.code.class("docs-pill").children(value))),
                      h.td.children(
                        v.default === undefined ? h.em.children("from name") : h.code.children(String(v.default))
                      )
                    )
                  )
                )
              )
          )
      : h.span,
    info ? h.p.class("docs-muted").children(`Slots: ${info.slots.join(", ")}`) : h.span,
    h.h2.children("Styles"),
    h.p.children("The whole component's look is this file. It only references the token contract."),
    page.style ? code(h, page.style) : h.span
  ]
}

const tokens = (h: H) =>
  Object.entries(DS.manifest.tokens).map(([group, t]) =>
    h.section.class("docs-token-group").children(
      h.h2.children(group, h.span.class("docs-token-kind").children(`${t.kind} · --${t.prefix}-*`)),
      h.div.class("docs-table-wrap").children(
        h.table.class("docs-table").children(
          h.thead.children(
            h.tr.children(
              h.th.children("Token"),
              ...themes.flatMap((th) => modes.map((m) => h.th.children(`${th.name} · ${m}`)))
            )
          ),
          h.tbody.children(
            ...t.keys.map((key) => {
              const name = `--${t.prefix}-${key.replaceAll(".", "_")}`
              return h.tr.children(
                h.td.children(h.code.class("docs-prop").children(`${group}.${key}`)),
                ...themes.flatMap((th) =>
                  modes.map((m) => {
                    const value = (m === "dark" ? th.vars.modes.dark?.[name] : undefined) ?? th.vars.base[name] ?? ""
                    return h.td
                      .class("docs-token-value")
                      .children(
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
  )

// ─── blocks ────────────────────────────────────────────────────────────────

const exampleBlock = (h: H, example: Example, model: Model, initial: Tab) => {
  const tab = model.tabs[example.id] ?? initial
  const tabButton = (t: Tab, label: string) =>
    h.button
      .class("docs-tab", tab === t && "docs-tab-active")
      .attr("aria-selected", tab === t ? "true" : "false")
      .attr("role", "tab")
      .on("click", Msg.PickedTab({ id: example.id, tab: t }))
      .children(label)
  const frame = (theme: string, mode: string, labelled: boolean) =>
    h.div
      .class("docs-frame")
      .attr("data-theme", theme)
      .attr("data-mode", mode)
      .children(
        labelled ? h.span.class("docs-frame-label").children(`${theme} · ${mode}`) : h.span,
        example.component(h, { key: `${example.id}:${theme}:${mode}` })
      )
  return h.section
    .class("docs-example")
    .children(
      h.div
        .class("docs-example-bar")
        .children(
          h.h3.children(example.title),
          h.div
            .class("docs-tabs")
            .attr("role", "tablist")
            .children(tabButton("preview", "Preview"), tabButton("themes", "Themes"), tabButton("code", "Code"))
        ),
      tab === "code"
        ? code(h, example.source, "docs-code-flush")
        : tab === "themes"
          ? h.div.class("docs-frames").children(...themes.flatMap((t) => modes.map((m) => frame(t.name, m, true))))
          : h.div.class("docs-frames docs-frames-single").children(frame(model.theme, model.mode, false))
    )
}

const code = (h: H, source: string, extra?: string) =>
  h.pre
    .class("docs-code", extra)
    .children(
      h.code.children(
        ...highlight(source.trim()).map(([kind, text]) =>
          kind === "plain" ? text : h.span.class(`tok-${kind}`).children(text)
        )
      )
    )
