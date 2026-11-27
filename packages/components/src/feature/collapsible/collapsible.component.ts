import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Collapsible as KitCollapsible } from "@effect/ui-kit/Collapsible"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { CollapsibleStyle } from "./collapsible.component.style.ts"

export const Collapsible = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly children: ReadonlyArray<Input<Msg, unknown>>
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: CollapsibleStyle, props: {} })
  return KitCollapsible(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open, disabled: options.disabled },
    onEmit: { Toggled: ({ open }) => options.onOpenChange({ open }), Settled: () => undefined },
    view: (collapsible) =>
      collapsible.root(h.div.class(classes.root)).children(
        collapsible.trigger(h.button.class(classes.trigger)).children(
          options.trigger,
          h.span
            .class(classes.icon)
            .attr("aria-hidden", "true")
            .children(
              Match.value(collapsible.open).pipe(
                Match.when(true, () => "−"),
                Match.orElse(() => "+")
              )
            )
        ),
        collapsible.panel(h.div.class(classes.panel))?.children(h.div.children(...options.children))
      )
  }) as Child<Msg>
}
