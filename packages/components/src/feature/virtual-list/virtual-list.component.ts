import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { VirtualList as KitVirtualList } from "@effect/ui-kit/VirtualList"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { VirtualListStyle } from "./virtual-list.component.style.ts"

export const VirtualList = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly count: number
    readonly itemSize: number
    readonly onItem: (event: { readonly index: number }) => Input<Msg, unknown>
    readonly initialCount?: number | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: VirtualListStyle, props: {} })
  return KitVirtualList(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { count: options.count, itemSize: options.itemSize, initialCount: options.initialCount ?? 20 },
    view: (virtual) =>
      virtual
        .viewport(h.div.class(classes.viewport).attr("aria-label", options.label))
        .children(
          virtual
            .list(h.ul.class(classes.list))
            .children(
              ...virtual.items.map((index) =>
                virtual
                  .item({ element: h.li.class(classes.item).key(`item-${index}`), index })
                  .children(options.onItem({ index }))
              )
            )
        )
  }) as Child<Msg>
}
