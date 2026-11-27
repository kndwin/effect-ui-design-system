import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { ScrollArea as KitScrollArea } from "@effect/ui-kit/ScrollArea"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { ScrollAreaStyle } from "./scroll-area.component.style.ts"

export const ScrollArea = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly children: ReadonlyArray<Input<Msg, unknown>>
    readonly label?: string | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ScrollAreaStyle, props: {} })
  return KitScrollArea(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    view: (scrollArea) =>
      scrollArea
        .root(h.div.class(classes.root))
        .children(
          scrollArea
            .viewport(h.div.class(classes.viewport).attr("aria-label", options.label))
            .children(scrollArea.content(h.div.class(classes.content)).children(...options.children)),
          scrollArea.scrollbar({ element: h.div.class(classes.scrollbar), thumb: h.div.class(classes.thumb) })
        )
  }) as Child<Msg>
}
