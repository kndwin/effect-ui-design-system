import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { PreviewCard as KitPreviewCard } from "@effect/ui-kit/PreviewCard"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { PreviewCardStyle } from "./preview-card.component.style.ts"

export const PreviewCard = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly href: string
    readonly children: ReadonlyArray<Input<Msg, unknown>>
    readonly side?: "top" | "bottom" | "left" | "right" | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: PreviewCardStyle, props: {} })
  return KitPreviewCard(h, {
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
    view: (card) =>
      h.span.children(
        card.trigger({ element: h.a.class(classes.trigger).attr("href", options.href) }).children(options.trigger),
        card
          .portal(h.div)
          ?.children(
            card
              .positioner(h.div.class(classes.positioner))
              .children(card.popup(h.div.class(classes.popup)).children(...options.children))
          )
      )
  }) as Child<Msg>
}
