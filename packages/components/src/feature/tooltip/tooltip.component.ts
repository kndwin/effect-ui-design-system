import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Tooltip as KitTooltip } from "@effect/ui-kit/Tooltip"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { TooltipStyle } from "./tooltip.component.style.ts"

export const Tooltip = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly label: string
    readonly trigger: string
    readonly content: string
    readonly side?: "top" | "bottom" | "left" | "right" | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: TooltipStyle, props: {} })
  return KitTooltip(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open, side: options.side ?? "top", sideOffset: 6 },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false })
    },
    view: (tooltip) =>
      h.span.children(
        Button(h, {
          element: tooltip.trigger(h.button),
          tone: "ghost",
          label: options.label,
          children: options.trigger
        }),
        tooltip
          .positioner(h.div.class(classes.positioner))
          .children(tooltip.popup(h.div.class(classes.popup)).children(options.content))
      )
  }) as Child<Msg>
}
