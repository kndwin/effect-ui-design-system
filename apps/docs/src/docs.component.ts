import { Button } from "@acme/components/button"
import { CodeBlock } from "@acme/components/code-block"
import { Center } from "@acme/components/layout/center"
import { Grid } from "@acme/components/layout/grid"
import { Layout, LayoutContent, LayoutHeader, LayoutPanel } from "@acme/components/layout/layout"
import { Section } from "@acme/components/layout/section"
import { HStack, StackItem, VStack } from "@acme/components/layout/stack"
import { manifest } from "@acme/components/manifest"
import { Swatch } from "@acme/components/swatch"
import { Text } from "@acme/components/text"
import type { Theme } from "@acme/design-system/Theme"
import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { Html } from "@effect/ui/html"
import { Array, Match } from "effect"
import { install, installCommand, type Page, pages, sources } from "./content.constant.ts"
import { initialChoices, scales } from "./customize.constant.ts"
import { type Choices, Mode, Model, Msg, type Tab } from "./docs.schema.ts"
import * as Customize from "./customize.pure.ts"
import { type Example, examples } from "./registry.constant.ts"

const themes: ReadonlyArray<Theme> = [shadcn, astryx]
type H = Html.H<typeof Msg.Type>

const currentTheme = (model: Model) => themes.find((t) => t.name === model.theme) ?? themes[0]!

const customStyle = (model: Model) =>
  Customize.styleOf(Customize.overrides(model.choices, themes, currentTheme(model), model.mode)) || undefined

export const Docs = Html.component({ name: "Docs", model: Model, message: Msg }).make({
  init: () => ({
    page: "introduction",
    theme: "shadcn",
    mode: "light",
    tabs: {},
    panel: false,
    choices: initialChoices
  }),
  update: {
    Navigated: ($, { page }) => $.evolve({ page }),
    PickedTheme: ($, { theme }) => $.evolve({ theme }),
    PickedMode: ($, { mode }) => $.evolve({ mode }),
    ToggledMode: ($) =>
      $.evolve({
        mode: (m) =>
          Match.value(m).pipe(
            Match.when("light", () => "dark" as const),
            Match.orElse(() => "light" as const)
          )
      }),
    PickedTab: ($, { id, tab }) => $.evolve({ tabs: (tabs) => ({ ...tabs, [id]: tab }) }),
    ToggledPanel: ($) => $.evolve({ panel: (p) => !p }),
    Chose: ($, { choices }) => $.evolve({ choices }),
    ResetChoices: ($) => $.evolve({ choices: initialChoices })
  },

  view: (h, model) => {
    const page = pages.find((p) => p.id === model.page) ?? pages[0]!
    return Layout(h.div)
      .attr("data-theme", model.theme)
      .attr("data-mode", model.mode)
      .attr("style", customStyle(model))
      .children(
        header(h, model),
        LayoutPanel(h.nav, { side: "start" }).attr("aria-label", "Pages").children(sidebar(h, page)),
        LayoutContent(h.main).children(
          VStack(h.div, { gap: "8" }).children(
            VStack(h.header, { gap: "2" }).children(
              Text(h.div, { size: "sm", tone: "muted", weight: "medium" }).children(page.section),
              Text(h.h1, { size: "2xl", weight: "semibold" }).children(page.title),
              Text(h.p, { size: "lg", tone: "muted" }).children(page.lead)
            ),
            ...body(h, model, page),
            pager(h, page)
          )
        ),
        Match.value(model.panel).pipe(
          Match.when(true, () =>
            LayoutPanel(h.aside, { side: "end" }).attr("aria-label", "Theme builder").children(builder(h, model))
          ),
          Match.orElse(() => undefined)
        )
      )
  }
})

const heading = (h: H, text: string) => Text(h.h2, { size: "xl", weight: "semibold" }).children(text)
const code = (h: H, text: string) => Text(h.code, { mono: true, size: "xs" }).children(text)
const pill = (h: H, text: string) =>
  Text(Section(h.code, { surface: "muted", pad: "1" }), { mono: true, size: "xs", tone: "muted" }).children(text)

const segmented = (
  h: H,
  label: string,
  items: ReadonlyArray<readonly [key: string, text: string, active: boolean, msg: typeof Msg.Type]>
) =>
  Section(h.div, { surface: "muted", pad: "1" })
    .attr("role", "group")
    .attr("aria-label", label)
    .children(
      HStack(h.div, { gap: "1" }).children(
        ...items.map(([key, text, active, msg]) =>
          Button(h, {
            tone: "ghost",
            size: "sm",
            pressed: active,
            onPress: msg,
            label: `${label}: ${key}`,
            children: text
          })
        )
      )
    )

const header = (h: H, model: Model) =>
  LayoutHeader(h.header).children(
    Button(h, {
      tone: "ghost",
      onPress: Msg.Navigated({ page: "introduction" }),
      children: [
        Swatch(h.span, { color: "var(--color-accent)" }),
        Text(h.span, { weight: "semibold", tone: "default" }).children("acme/ui")
      ]
    }),
    HStack(h.div, { gap: "2", wrap: true, justify: "end" }).children(
      segmented(
        h,
        "Theme",
        themes.map((t) => [t.name, t.name, model.theme === t.name, Msg.PickedTheme({ theme: t.name })] as const)
      ),
      Button(h, {
        size: "sm",
        onPress: Msg.ToggledMode(),
        label: Match.value(model.mode === "light").pipe(
          Match.when(true, () => "Dark mode"),
          Match.orElse(() => "Light mode")
        ),
        children: Match.value(model.mode === "light").pipe(
          Match.when(true, () => "☾"),
          Match.orElse(() => "☀")
        )
      }),
      Button(h, {
        size: "sm",
        tone: Match.value(model.panel).pipe(
          Match.when(true, () => "primary" as const),
          Match.orElse(() => "neutral" as const)
        ),
        onPress: Msg.ToggledPanel(),
        children: Match.value(Customize.isCustomized(model.choices)).pipe(
          Match.when(true, () => "Theme builder •"),
          Match.orElse(() => "Theme builder")
        )
      }),
      Text(h.a, { size: "sm", tone: "muted" })
        .attr("href", "https://github.com/kndwin/effect-ui-design-system")
        .attr("target", "_blank")
        .children("GitHub")
    )
  )

const sidebar = (h: H, current: Page) =>
  VStack(h.div, { gap: "6" }).children(
    ...[...new Set(pages.map((p) => p.section))].map((section) =>
      VStack(h.div, { gap: "1" }).children(
        Text(h.div, { size: "xs", weight: "semibold", tone: "muted", caps: true }).children(section),
        ...pages
          .filter((p) => p.section === section)
          .map((p) =>
            Button(h, {
              tone: "ghost",
              size: "sm",
              fill: true,
              pressed: p.id === current.id,
              onPress: Msg.Navigated({ page: p.id }),
              children: p.title
            })
          )
      )
    )
  )

const pager = (h: H, page: Page) => {
  const i = pages.indexOf(page)
  const link = (at: number, label: (p: Page) => string) =>
    Match.value(Array.get(pages, at)).pipe(
      Match.tag("None", () => h.span),
      Match.tag("Some", ({ value }) =>
        Button(h, { onPress: Msg.Navigated({ page: value.id }), children: label(value) })
      ),
      Match.exhaustive
    )
  return HStack(h.nav, { justify: "between", gap: "3" }).children(
    link(i - 1, (p) => `← ${p.title}`),
    link(i + 1, (p) => `${p.title} →`)
  )
}

const builder = (h: H, model: Model) => {
  const c = model.choices
  const base = currentTheme(model)
  const choose = (patch: Partial<Choices>) => Msg.Chose({ choices: { ...c, ...patch } })
  const row = (title: string, tokens: ReadonlyArray<string>, content: ReturnType<H["div"]["class"]>) =>
    VStack(h.section, { gap: "2" }).children(
      HStack(h.div, { justify: "between", gap: "2", wrap: true }).children(
        Text(h.h3, { size: "sm", weight: "semibold" }).children(title),
        HStack(h.div, { gap: "1", wrap: true }).children(...tokens.map((t) => pill(h, t)))
      ),
      content
    )
  return VStack(h.div, { gap: "6" }).children(
    HStack(h.div, { justify: "between", align: "start", gap: "2" }).children(
      VStack(h.div, { gap: "1" }).children(
        Text(h.h2, { size: "lg", weight: "semibold" }).children("Theme builder"),
        Text(h.p, { size: "sm", tone: "muted" }).children(
          "Mix token values from the installed themes. Every choice is a value some theme defines."
        )
      ),
      Button(h, { tone: "ghost", size: "sm", onPress: Msg.ToggledPanel(), label: "Close", children: "✕" })
    ),
    row(
      "Start from",
      ["*.theme.ts", "data-mode"],
      VStack(h.div, { gap: "2" }).children(
        segmented(
          h,
          "Base theme",
          themes.map((t) => [t.name, t.name, model.theme === t.name, Msg.PickedTheme({ theme: t.name })] as const)
        ),
        segmented(
          h,
          "Mode",
          Mode.literals.map(
            (m) =>
              [
                m,
                Match.value(m === "light").pipe(
                  Match.when(true, () => "☀ Light"),
                  Match.orElse(() => "☾ Dark")
                ),
                model.mode === m,
                Msg.PickedMode({ mode: m })
              ] as const
          )
        )
      )
    ),
    ...Customize.controls(themes).map((control) =>
      row(
        control.title,
        control.tokens,
        HStack(h.div, { gap: "2", wrap: true }).children(
          Button(h, {
            size: "sm",
            pressed: c[control.id] === null,
            onPress: choose({ [control.id]: null }),
            children: "Base"
          }),
          ...control.options.map((o) =>
            Button(h, {
              size: "sm",
              pressed: c[control.id] === o.id,
              onPress: choose({ [control.id]: o.id }),
              label: o.source,
              children: [
                ...Match.value(o.swatch).pipe(
                  Match.when(undefined, () => []),
                  Match.orElse((swatch) => [Swatch(h.span, { color: swatch(model.mode), size: "sm", round: true })])
                ),
                Match.value(control.id === "font" || control.id === "mono").pipe(
                  Match.when(true, () => h.span.attr("style", `font-family:${o.sample}`).children(o.label)),
                  Match.orElse(() =>
                    Match.value(control.id === "radius" && o.sample !== undefined).pipe(
                      Match.when(true, () => `${o.label} · ${o.sample}`),
                      Match.orElse(() => o.label)
                    )
                  )
                )
              ]
            })
          )
        )
      )
    ),
    row(
      "Scale",
      ["× Spacing.*", "Size.*", "Text.*"],
      segmented(
        h,
        "Scale",
        scales.map((s) => [String(s), `${s}%`, c.scale === s, choose({ scale: s })] as const)
      )
    ),
    CodeBlock(h, {
      code: Customize.themeSource(c, themes, base),
      title: "custom.theme.ts",
      size: "sm",
      key: "theme-source"
    }),
    Button(h, { size: "sm", fill: true, onPress: Msg.ResetChoices(), children: "Reset" })
  )
}

const body = (h: H, model: Model, page: Page) =>
  Match.value(page.id).pipe(
    Match.when("introduction", () => [
      ...examples.filter((e) => e.page === "introduction").map((e) => exampleBlock(h, e, model, "themes")),
      VStack(h.section, { gap: "4" }).children(
        heading(h, "How it fits together"),
        Grid(h.div, { columns: "3", gap: "3", stack: true }).children(
          stackCard(
            h,
            "@acme/design-system",
            "Token kinds, Theme, Variant, Style. Knows ui-kit's parts and data attributes."
          ),
          stackCard(h, "@acme/components", "The token contract (names only) and the components styled against it."),
          stackCard(h, "@acme/theme-*", "Values for every token, plus modes. shadcn and astryx ship here.")
        )
      ),
      VStack(h.section, { gap: "3" }).children(
        heading(h, "Usage"),
        CodeBlock(h, { code: installCommand, language: "shell", key: "install" }),
        CodeBlock(h, { code: install, title: "main.ts", key: "usage" })
      )
    ]),
    Match.when("theming", () => [
      VStack(h.section, { gap: "3" }).children(
        heading(h, "The contract"),
        Text(h.p).children(
          "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected."
        ),
        CodeBlock(h, {
          code: sources.contract,
          title: "packages/components/src/contract.token.ts",
          lineNumbers: true,
          key: "contract"
        })
      ),
      VStack(h.section, { gap: "3" }).children(
        heading(h, "A theme"),
        Text(h.p).children(
          'Theme.make won\'t compile unless every key is filled in. Values are decoded at build time, so "purple" for a colour fails the build with the theme, mode and path. Or open the theme builder to make one.'
        ),
        ...themes.map((t) =>
          CodeBlock(h, {
            code: sources.themes[t.name as keyof typeof sources.themes],
            title: `packages/themes/${t.name}/src/${t.name}.theme.ts`,
            lineNumbers: true,
            key: `theme-${t.name}`
          })
        )
      )
    ]),
    Match.when("tokens", () => tokens(h)),
    Match.orElse(() => component(h, model, page))
  )

const stackCard = (h: H, name: string, text: string) =>
  Section(h.div, { surface: "card", pad: "4", gap: "2" }).children(
    Text(h.code, { mono: true, weight: "semibold", size: "sm" }).children(name),
    Text(h.p, { size: "sm", tone: "muted" }).children(text)
  )

const component = (h: H, model: Model, page: Page) => {
  const info = manifest.components.find((c) => c.kit === page.kit)
  return [
    VStack(h.section, { gap: "4" }).children(
      heading(h, "Examples"),
      ...examples.filter((e) => e.page === page.id).map((e) => exampleBlock(h, e, model, "preview"))
    ),
    Match.value(info).pipe(
      Match.when(undefined, () => h.span),
      Match.orElse((info) =>
        VStack(h.section, { gap: "3" }).children(
          heading(h, "API"),
          Section(h.div, { surface: "card", pad: "4" }).children(
            Grid(h.div, { columns: "3", gap: "3" }).children(
              ...["Variant", "Values", "Default"].map((t) =>
                Text(h.div, { size: "xs", tone: "muted", weight: "medium" }).children(t)
              ),
              ...Object.entries(info.variants).flatMap(([name, v]) => [
                Text(h.code, { mono: true, size: "sm", weight: "medium" }).children(name),
                HStack(h.div, { gap: "1", wrap: true }).children(...v.values.map((value) => pill(h, value))),
                Match.value(v.default === undefined).pipe(
                  Match.when(true, () => Text(h.em, { size: "sm", tone: "muted" }).children("derived")),
                  Match.orElse(() => code(h, String(v.default)))
                )
              ])
            )
          ),
          Text(h.p, { size: "sm", tone: "muted" }).children(`Slots: ${info.slots.join(", ")}`)
        )
      )
    ),
    Match.value(page.style).pipe(
      Match.when(undefined, () => h.span),
      Match.orElse((style) =>
        VStack(h.section, { gap: "3" }).children(
          heading(h, "Styles"),
          Text(h.p).children("The whole component's look is this file. It only references the token contract."),
          CodeBlock(h, { code: style, title: page.styleFile, lineNumbers: true, key: `style-${page.id}` })
        )
      )
    )
  ]
}

const tokens = (h: H) =>
  Object.entries(manifest.tokens).map(([group, t]) =>
    VStack(h.section, { gap: "3" }).children(
      HStack(h.div, { gap: "3", align: "baseline", wrap: true }).children(
        heading(h, group),
        Text(h.span, { mono: true, size: "xs", tone: "muted" }).children(`${t.kind} · --${t.prefix}-*`)
      ),
      Section(h.div, { surface: "card", pad: "4" }).children(
        Grid(h.div, { columns: "5", gap: "2" }).children(
          ...["Token", ...themes.flatMap((th) => Mode.literals.map((m) => `${th.name} · ${m}`))].map((label) =>
            Text(h.div, { size: "xs", tone: "muted", weight: "medium", truncate: true }).children(label)
          ),
          ...t.keys.flatMap((key) => {
            const name = `--${t.prefix}-${key.replaceAll(".", "_")}`
            return [
              Text(h.code, { mono: true, size: "xs", weight: "medium", truncate: true }).children(`${group}.${key}`),
              ...themes.flatMap((th) =>
                Mode.literals.map((m) => {
                  const value = Customize.varsOf(th, m)[name] ?? ""
                  return HStack(h.div, { gap: "2" }).children(
                    Match.value(t.kind === "Color").pipe(
                      Match.when(true, () => Swatch(h.span, { color: value, size: "sm" })),
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

const exampleBlock = (h: H, example: Example, model: Model, initial: Tab) => {
  const tab = model.tabs[example.id] ?? initial

  const frame = (theme: string, mode: string, labelled: boolean, style?: string) =>
    Section(h.div, { surface: "base", pad: "6", gap: "4" })
      .attr("data-theme", theme)
      .attr("data-mode", mode)
      .attr("style", style)
      .children(
        Match.value(labelled).pipe(
          Match.when(true, () => Text(h.span, { size: "xs", tone: "muted" }).children(`${theme} · ${mode}`)),
          Match.orElse(() => h.span)
        ),
        Center(h.div).children(example.component(h, { key: `${example.id}:${theme}:${mode}` }))
      )
  return Section(h.section, { surface: "card" }).children(
    Section(h.div, { pad: "3", divided: true }).children(
      HStack(h.div, { justify: "between", gap: "2", wrap: true }).children(
        StackItem(Text(h.h3, { size: "sm", weight: "medium" }), { grow: true }).children(example.title),
        HStack(h.div, { gap: "1" })
          .attr("role", "tablist")
          .children(
            ...(["preview", "themes", "code"] as const).map((t) =>
              Button(h, {
                tone: "ghost",
                size: "sm",
                pressed: tab === t,
                onPress: Msg.PickedTab({ id: example.id, tab: t }),
                children: t[0]!.toUpperCase() + t.slice(1)
              })
            )
          )
      )
    ),
    Match.value(tab === "code").pipe(
      Match.when(true, () =>
        Section(h.div, { pad: "3" }).children(
          CodeBlock(h, { code: example.source.trim(), title: example.file, key: `code-${example.id}` })
        )
      ),
      Match.orElse(() =>
        Match.value(tab === "themes").pipe(
          Match.when(true, () =>
            Grid(h.div, { columns: "2", stack: true }).children(
              ...themes.flatMap((t) => Mode.literals.map((m) => frame(t.name, m, true)))
            )
          ),
          Match.orElse(() => frame(model.theme, model.mode, false, customStyle(model)))
        )
      )
    )
  )
}
