import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Tabs as KitTabs } from "@effect/ui-kit/Tabs"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { TabsStyle } from "./tabs.component.style.ts"

export const Tabs = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly value: string | null
    readonly onSelect: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly tabs: ReadonlyArray<{
      readonly value: string
      readonly label: string
      readonly disabled?: boolean
      readonly content: ReadonlyArray<Input<Msg, unknown>>
    }>
    readonly label?: string | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: TabsStyle, props: {} })
  return KitTabs(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { value: options.value, tabs: options.tabs.map(({ value, disabled }) => ({ value, disabled })) },
    onEmit: { Selected: ({ value }) => options.onSelect({ value }) },
    view: (tabs) =>
      tabs
        .root(h.div.class(classes.root))
        .children(
          tabs
            .list(h.div.class(classes.list).attr("aria-label", options.label))
            .children(
              ...options.tabs.map(({ value, label }) =>
                tabs.tab({ element: h.button.class(classes.tab), value }).children(label)
              ),
              tabs.indicator(h.span.class(classes.indicator))
            ),
          ...options.tabs.map(({ value, content }) =>
            tabs.panel({ element: h.div.class(classes.panel), value })?.children(...content)
          )
        )
  }) as Child<Msg>
}
