import { Button, ButtonLink } from "@weft/components/button"
import { Layout, LayoutContent, LayoutHeader, LayoutPanel } from "@weft/components/layout/layout"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { Head } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import { Array, Match } from "effect"
import { ComponentDocsPage } from "../../feature/component-docs/component-docs.view.ts"
import { IntroductionPage } from "../../feature/introduction/introduction.view.ts"
import { ThemeBuilder } from "../../feature/theme-builder/theme-builder.component.ts"
import { getOverrides } from "../../feature/theme-builder/customize.pure.ts"
import { mapVarsToInlineStyle } from "../../feature/theme-builder/customize.pure.map.ts"
import { isCustomized } from "../../feature/theme-builder/customize.pure.predicate.ts"
import { ThemingPage } from "../../feature/theming/theming.view.ts"
import { TokensPage } from "../../feature/tokens/tokens.view.ts"
import { pages } from "../content/content.constant.ts"
import type { Page } from "../content/content.schema.ts"
import { getTheme, getThemeVars } from "../theme/theme.pure.ts"
import { Logo } from "../ui/ui.view.ts"
import type { Look } from "../theme/theme.schema.ts"
import { themes } from "../theme/themes.constant.ts"
import { AppDef } from "./app.define.ts"
import { getPage, getPageRoute } from "./app.pure.ts"
import { AppRoute } from "./app.route.ts"
import { type AppModel, AppMessageSchema } from "./app.schema.ts"

type H = Html.H<typeof AppMessageSchema.Type>

const getLook = (model: AppModel): Look => {
  const { theme, mode } = model.route.search
  const vars = getOverrides({ choices: model.choices, themes, theme: getTheme({ name: theme }), mode })
  return { theme, mode, style: mapVarsToInlineStyle({ vars }) || undefined }
}

const Header = AppDef.fragment((h, model: AppModel) =>
  LayoutHeader(h.header).children(
    ButtonLink(h.a.attr("href", AppRoute.print(getPageRoute({ id: "introduction", route: model.route }))), {
      tone: "ghost"
    }).children(Logo(h, 20), Text(h.span, { weight: "semibold", tone: "default" }).children("weft")),
    HStack(h.div, { gap: "2", wrap: true, justify: "end" }).children(
      Button(h, {
        size: "sm",
        onPress: AppMessageSchema.PressedMode(),
        label: Match.value(model.route.search.mode).pipe(
          Match.when("light", () => "Dark mode"),
          Match.orElse(() => "Light mode")
        ),
        children: Match.value(model.route.search.mode).pipe(
          Match.when("light", () => "☾"),
          Match.orElse(() => "☀")
        )
      }),
      Button(h, {
        size: "sm",
        tone: Match.value(model.panel).pipe(
          Match.when(true, () => "primary" as const),
          Match.orElse(() => "neutral" as const)
        ),
        onPress: AppMessageSchema.PressedPanel(),
        children: Match.value(isCustomized({ choices: model.choices })).pipe(
          Match.when(true, () => "Theme: custom"),
          Match.orElse(() => `Theme: ${model.route.search.theme}`)
        )
      }),
      Text(h.a, { size: "sm", tone: "muted" })
        .attr("href", "https://github.com/kndwin/weft")
        .attr("target", "_blank")
        .children("GitHub")
    )
  )
)

const PageLink = (h: H, model: AppModel, page: Page, text: string, current: boolean, fill: boolean) =>
  ButtonLink(
    h.a.attr("href", AppRoute.print(getPageRoute({ id: page.id, route: model.route }))).attr(
      "aria-current",
      Match.value(current).pipe(
        Match.when(true, () => "page"),
        Match.orElse(() => undefined)
      )
    ),
    { tone: "ghost", size: "sm", fill }
  ).children(text)

const Sidebar = AppDef.fragment((h, model: AppModel, current: Page | undefined) =>
  VStack(h.div, { gap: "6" }).children(
    ...Array.dedupe(pages.map((page) => page.section)).map((section) =>
      VStack(h.div, { gap: "1" }).children(
        Text(h.div, { size: "xs", weight: "semibold", tone: "muted", caps: true }).children(section),
        ...pages
          .filter((page) => page.section === section)
          .map((page) => PageLink(h, model, page, page.title, page.id === current?.id, true))
      )
    )
  )
)

const Pager = AppDef.fragment((h, model: AppModel, page: Page) => {
  const index = pages.indexOf(page)
  const link = (at: number, label: (p: Page) => string) =>
    Match.value(Array.get(pages, at)).pipe(
      Match.tag("None", () => h.span),
      Match.tag("Some", ({ value }) => PageLink(h, model, value, label(value), false, false)),
      Match.exhaustive
    )
  return HStack(h.nav, { justify: "between", gap: "3" }).children(
    link(index - 1, (p) => `← ${p.title}`),
    link(index + 1, (p) => `${p.title} →`)
  )
})

const Body = AppDef.fragment((h, model: AppModel, page: Page) =>
  AppRoute.match(model.route, {
    Introduction: () => IntroductionPage(h, getLook(model)),
    Theming: () => ThemingPage(h),
    Component: () => ComponentDocsPage(h, page, getLook(model)),
    Tokens: () => {
      const { theme, mode } = model.route.search
      const base = getTheme({ name: theme })
      return TokensPage(h, {
        ...getThemeVars({ theme: base, mode }),
        ...getOverrides({ choices: model.choices, themes, theme: base, mode })
      })
    },
    NotFound: () => []
  })
)

const Content = AppDef.fragment((h, model: AppModel) =>
  Match.value(getPage({ route: model.route })).pipe(
    Match.when(undefined, () =>
      VStack(h.div, { gap: "4" }).children(
        Text(h.h1, { size: "2xl", weight: "semibold" }).children("Not found"),
        Text(h.p, { size: "lg", tone: "muted" }).children("There's no page at this address."),
        PageLink(h, model, pages[0]!, "Back to the introduction", false, false)
      )
    ),
    Match.orElse((page) =>
      VStack(h.div, { gap: "8" }).children(
        VStack(h.header, { gap: "2" }).children(
          Text(h.div, { size: "sm", tone: "muted", weight: "medium" }).children(page.section),
          Text(h.h1, { size: "2xl", weight: "semibold" }).children(page.title),
          Text(h.p, { size: "lg", tone: "muted" }).children(page.lead)
        ),
        ...Body(h, model, page),
        Pager(h, model, page)
      )
    )
  )
)

export const view = AppDef.view((h, model) => {
  const look = getLook(model)
  return Layout(h.div)
    .attr("data-theme", look.theme)
    .attr("data-mode", look.mode)
    .attr("style", look.style)
    .children(
      Header(h, model),
      LayoutPanel(h.nav, { side: "start" })
        .attr("aria-label", "Pages")
        .children(Sidebar(h, model, getPage(model))),
      LayoutContent(h.main).children(Content(h, model)),
      Match.value(model.panel).pipe(
        Match.when(true, () =>
          LayoutPanel(h.aside, { side: "end" })
            .attr("aria-label", "Theme")
            .children(
              ThemeBuilder(h, {
                key: "theme-builder",
                props: { theme: look.theme, mode: look.mode, choices: model.choices },
                onEmit: {
                  PickedTheme: ({ theme }) => AppMessageSchema.PickedTheme({ theme }),
                  PickedMode: ({ mode }) => AppMessageSchema.PickedMode({ mode }),
                  Chose: ({ choices }) => AppMessageSchema.Chose({ choices }),
                  Reset: () => AppMessageSchema.ResetChoices(),
                  Closed: () => AppMessageSchema.PressedPanel()
                }
              })
            )
        ),
        Match.orElse(() => undefined)
      )
    )
})

export const head = ({ model }: { readonly model: AppModel }) => [
  Head.title(
    Match.value(getPage({ route: model.route })).pipe(
      Match.when(undefined, () => "Not found · weft"),
      Match.orElse((page) => `${page.title} · weft`)
    )
  )
]
