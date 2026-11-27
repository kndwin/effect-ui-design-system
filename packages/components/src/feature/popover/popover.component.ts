import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Popover as KitPopover } from "@effect/ui-kit/Popover"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { PopoverStyle } from "./popover.component.style.ts"

export const Popover = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly title?: string | undefined
    readonly description?: string | undefined
    readonly children?: ReadonlyArray<Input<Msg, unknown>> | undefined
    readonly side?: "top" | "bottom" | "left" | "right" | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: PopoverStyle, props: {} })
  return KitPopover(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open, side: options.side ?? "bottom", sideOffset: 8 },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false }),
      Settled: () => undefined
    },
    view: (popover) =>
      h.span.children(
        Button(h, { element: popover.trigger({ element: h.button }), children: options.trigger }),
        popover.portal(h.dialog)?.children(
          popover.positioner(h.div.class(classes.positioner)).children(
            popover.popup(h.div.class(classes.popup)).children(
              Match.value(options.title).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((text) => popover.title(h.h2.class(classes.title)).children(text))
              ),
              Match.value(options.description).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((text) => popover.description(h.p.class(classes.description)).children(text))
              ),
              h.div.class(classes.body).children(...(options.children ?? []))
            )
          )
        )
      )
  }) as Child<Msg>
}
