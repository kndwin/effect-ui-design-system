import { Button, CodeBlock, DS } from "@acme/components"
import type { Theme } from "@acme/ds/Theme"
import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { install, installCommand, type Page, pages, sources } from "./content.pure.ts"
import * as Customize from "./customize.pure.ts"
import { type Example, examples } from "./registry.pure.ts"

const themes: ReadonlyArray<Theme> = [shadcn, astryx]
const modes = ["light", "dark"] as const
const Mode = Schema.Literals(modes)
const Tab = Schema.Literals(["preview", "code", "themes"])
type Tab = typeof Tab.Type

const Choices = Schema.Struct({
  accent: Schema.NullOr(Schema.String),
  gray: Schema.NullOr(Schema.String),
  radius: Schema.NullOr(Schema.String),
  scaling: Schema.Number,
  font: Schema.NullOr(Schema.String)
})

const Msg = UiSchema.TaggedEnum({
  Navigated: { page: Schema.String },
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: Mode },
  ToggledMode: {},
  PickedTab: { id: Schema.String, tab: Tab },
  ToggledPanel: {},
  Chose: { choices: Choices },
  ResetChoices: {}
})
type H = Html.H<typeof Msg.Type>

const Model = Schema.Struct({
  page: Schema.String,
  theme: Schema.String,
  mode: Mode,
  tabs: Schema.Record(Schema.String, Tab),
  panel: Schema.Boolean,
  choices: Choices
})
type Model = typeof Model.Type

const currentTheme = (model: Model) => themes.find((t) => t.name === model.theme) ?? themes[0]!
/** The customizer's CSS variable overrides, as an inline style. */
const customStyle = (model: Model) =>
  Customize.styleOf(Customize.overrides(model.choices, currentTheme(model), model.mode)) || undefined

export const Docs = Html.component({ name: "Docs", model: Model, message: Msg }).make({
  init: () => ({
    page: "introduction",
    theme: "shadcn",
    mode: "light",
    tabs: {},
    panel: false,
    choices: Customize.initialChoices
  }),
  update: {
    Navigated: ($, { page }) => $.evolve({ page }),
    PickedTheme: ($, { theme }) => $.evolve({ theme }),
    PickedMode: ($, { mode }) => $.evolve({ mode }),
    ToggledMode: ($) => $.evolve({ mode: (m) => (m === "light" ? "dark" : "light") }),
    PickedTab: ($, { id, tab }) => $.evolve({ tabs: (tabs) => ({ ...tabs, [id]: tab }) }),
    ToggledPanel: ($) => $.evolve({ panel: (p) => !p }),
    Chose: ($, { choices }) => $.evolve({ choices }),
    ResetChoices: ($) => $.evolve({ choices: Customize.initialChoices })
  },
  // The docs chrome sits inside the same data-theme / data-mode as the examples and
  // reads the same contract variables, so it re-themes with them, customizer included.
  view: (h, model) => {
    const page = pages.find((p) => p.id === model.page) ?? pages[0]!
    return h.div
      .class("docs", model.panel && "docs-with-panel")
      .attr("data-theme", model.theme)
      .attr("data-mode", model.mode)
      .attr("style", customStyle(model))
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
          ),
        model.panel ? panel(h, model) : undefined
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
      segmented(
        h,
        "Theme",
        themes.map((t) => [t.name, t.name, model.theme === t.name, Msg.PickedTheme({ theme: t.name })] as const)
      ),
      Button(h, {
        size: "sm",
        onPress: Msg.ToggledMode(),
        class: "docs-icon-button",
        children: model.mode === "light" ? "☾" : "☀"
      }),
      Button(h, {
        size: "sm",
        tone: model.panel ? "primary" : "neutral",
        onPress: Msg.ToggledPanel(),
        children: Customize.isCustomized(model.choices) ? "Customize •" : "Customize"
      }),
      h.a
        .class("docs-header-link")
        .attr("href", "https://github.com/kndwin/effect-ui-design-system")
        .attr("target", "_blank")
        .children("GitHub")
    )
  )

const segmented = (
  h: H,
  label: string,
  items: ReadonlyArray<readonly [key: string, text: string, active: boolean, msg: typeof Msg.Type]>
) =>
  h.div
    .class("docs-segmented")
    .attr("role", "group")
    .attr("aria-label", label)
    .children(
      ...items.map(([key, text, active, msg]) =>
        h.button
          .class("docs-segment", active && "docs-segment-active")
          .attr("aria-pressed", active ? "true" : "false")
          .attr("data-key", key)
          .on("click", msg)
          .children(text)
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

// ─── customizer panel ──────────────────────────────────────────────────────

const panel = (h: H, model: Model) => {
  const c = model.choices
  const choose = (patch: Partial<Customize.Choices>) => Msg.Chose({ choices: { ...c, ...patch } })
  const section = (title: string, tokens: ReadonlyArray<string>, content: ReturnType<H["div"]["class"]>) =>
    h.section
      .class("docs-panel-section")
      .children(
        h.div.class("docs-panel-heading").children(h.h3.children(title), h.code.children(tokens.join(" · "))),
        content
      )
  const option = (active: boolean, msg: typeof Msg.Type, cls: string, label: string) =>
    h.button
      .class(cls, active && `${cls}-active`)
      .attr("aria-pressed", active ? "true" : "false")
      .attr("aria-label", label)
      .attr("title", label)
      .on("click", msg)
  return h.aside
    .class("docs-panel")
    .attr("aria-label", "Customize theme")
    .children(
      h.div
        .class("docs-panel-top")
        .children(
          h.h2.children("Theme"),
          h.button.class("docs-panel-close").attr("aria-label", "Close").on("click", Msg.ToggledPanel()).children("✕")
        ),
      section(
        "Base theme",
        ["@acme/theme-*"],
        h.div
          .class("docs-panel-grid docs-panel-grid-2")
          .children(
            ...themes.map((t) =>
              option(model.theme === t.name, Msg.PickedTheme({ theme: t.name }), "docs-tile", t.name).children(t.name)
            )
          )
      ),
      section(
        "Accent color",
        Customize.sets.accent,
        h.div
          .class("docs-swatches")
          .children(
            option(c.accent === null, choose({ accent: null }), "docs-swatch-button", "Theme default").children(
              h.span.class("docs-swatch-dot docs-swatch-default")
            ),
            ...Customize.accents.map(([name, color]) =>
              option(c.accent === name, choose({ accent: name }), "docs-swatch-button", name).children(
                h.span.class("docs-swatch-dot").attr("style", `background:${color}`)
              )
            )
          )
      ),
      section(
        "Gray color",
        Customize.sets.gray,
        h.div
          .class("docs-swatches")
          .children(
            option(c.gray === null, choose({ gray: null }), "docs-swatch-button", "Theme default").children(
              h.span.class("docs-swatch-dot docs-swatch-default")
            ),
            ...Object.entries(Customize.grays).map(([name, [color]]) =>
              option(c.gray === name, choose({ gray: name }), "docs-swatch-button", name).children(
                h.span.class("docs-swatch-dot").attr("style", `background:${color}`)
              )
            )
          )
      ),
      section(
        "Appearance",
        ["data-mode"],
        h.div
          .class("docs-panel-grid docs-panel-grid-2")
          .children(
            ...modes.map((m) =>
              option(model.mode === m, Msg.PickedMode({ mode: m }), "docs-tile", m).children(
                m === "light" ? "☀  Light" : "☾  Dark"
              )
            )
          )
      ),
      section(
        "Radius",
        Customize.sets.radius,
        h.div
          .class("docs-panel-grid docs-panel-grid-5")
          .children(
            ...Object.entries(Customize.radii).map(([name, r]) =>
              h.div
                .class("docs-radius")
                .children(
                  option(c.radius === name, choose({ radius: name }), "docs-tile", name).children(
                    h.span
                      .class("docs-radius-shape")
                      .attr("style", `border-top-left-radius:${Math.min(r.control, 18)}px`)
                  ),
                  h.span.class("docs-radius-label").children(name[0]!.toUpperCase() + name.slice(1))
                )
            )
          )
      ),
      section(
        "Scaling",
        Customize.sets.scaling,
        h.div
          .class("docs-panel-grid docs-panel-grid-5")
          .children(
            ...Customize.scalings.map((s) =>
              option(c.scaling === s, choose({ scaling: s }), "docs-tile", `${s}%`).children(`${s}%`)
            )
          )
      ),
      section(
        "Font",
        Customize.sets.font,
        h.div.class("docs-panel-grid docs-panel-grid-2").children(
          option(c.font === null, choose({ font: null }), "docs-tile", "Theme default").children("Default"),
          ...Object.entries(Customize.fonts).map(([name, stack]) =>
            option(c.font === name, choose({ font: name }), "docs-tile", name)
              .attr("style", `font-family:${stack.map((f) => (/^[a-z-]+$/.test(f) ? f : `'${f}'`)).join(",")}`)
              .children(name)
          )
        )
      ),
      h.section.class("docs-panel-section").children(
        h.div
          .class("docs-panel-heading")
          .children(h.h3.children("Copy theme"), h.code.children("Theme.make(Tokens, …)")),
        CodeBlock(h, {
          code: Customize.themeSource(c, currentTheme(model)),
          title: "theme.css.ts",
          size: "sm",
          key: "theme-source",
          class: "docs-panel-code"
        }),
        Button(h, { size: "sm", onPress: Msg.ResetChoices(), children: "Reset", class: "docs-panel-reset" })
      )
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
        CodeBlock(h, { code: installCommand, language: "shell", key: "install" }),
        h.div.class("docs-gap"),
        CodeBlock(h, { code: install, title: "main.ts", key: "usage" })
      ]
    case "theming":
      return [
        h.h2.children("The contract"),
        h.p.children(
          "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected."
        ),
        CodeBlock(h, {
          code: sources.contract,
          title: "packages/components/src/tokens.ts",
          lineNumbers: true,
          key: "contract"
        }),
        h.h2.children("A theme"),
        h.p.children(
          'Theme.make won\'t compile unless every key is filled in. Values are decoded at build time, so "purple" for a colour fails vite build with the theme, mode and path. Or open Customize to build one.'
        ),
        ...themes.map((t) =>
          h.details
            .class("docs-details")
            .attr("open", t.name === model.theme ? "" : undefined)
            .children(
              h.summary.children(`@acme/theme-${t.name}`),
              CodeBlock(h, {
                code: sources.themes[t.name as keyof typeof sources.themes],
                title: `packages/themes/${t.name}/src/theme.css.ts`,
                lineNumbers: true,
                key: `theme-${t.name}`
              })
            )
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
                  h.tr.children(h.th.children("Variant"), h.th.children("Values"), h.th.children("Default"))
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
    page.style
      ? CodeBlock(h, { code: page.style, title: page.styleFile, lineNumbers: true, key: `style-${page.id}` })
      : h.span
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
                    const dark = (th.vars.modes as Record<string, Record<string, string>>)["dark"]
                    const value = (m === "dark" ? dark?.[name] : undefined) ?? th.vars.base[name] ?? ""
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
  // A frame re-declares its theme's variables, so the customizer's overrides go on it
  // too. The Themes grid shows the stock themes.
  const frame = (theme: string, mode: string, labelled: boolean, style?: string) =>
    h.div
      .class("docs-frame")
      .attr("data-theme", theme)
      .attr("data-mode", mode)
      .attr("style", style)
      .children(
        labelled ? h.span.class("docs-frame-label").children(`${theme} · ${mode}`) : h.span,
        example.component(h, { key: `${example.id}:${theme}:${mode}` })
      )
  return h.section.class("docs-example").children(
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
      ? CodeBlock(h, {
          code: example.source.trim(),
          title: example.file,
          key: `code-${example.id}`,
          class: "docs-example-code"
        })
      : tab === "themes"
        ? h.div.class("docs-frames").children(...themes.flatMap((t) => modes.map((m) => frame(t.name, m, true))))
        : h.div
            .class("docs-frames docs-frames-single")
            .children(frame(model.theme, model.mode, false, customStyle(model)))
  )
}
