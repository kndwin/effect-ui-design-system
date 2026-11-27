import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { SortableList as KitSortableList } from "@effect/ui-kit/SortableList"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Match, Option } from "effect"
import { SortableListStyle } from "./sortable-list.component.style.ts"

export const SortableList = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly items: ReadonlyArray<{ readonly id: string; readonly label: string }>
    readonly onReorder: (event: { readonly from: number; readonly to: number }) => NoInfer<Msg> | undefined
    readonly orientation?: "horizontal" | "vertical" | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: SortableListStyle, props: {} })
  const getLabel = (id: string) =>
    Array.findFirst(options.items, (item) => item.id === id).pipe(
      Option.map((item) => item.label),
      Option.getOrElse(() => id)
    )
  return KitSortableList(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      items: options.items.map((item) => item.id),
      orientation: options.orientation,
      disabled: options.disabled
    },
    onEmit: ({ from, to }) => options.onReorder({ from, to }),
    view: (sortable) =>
      h.div.children(
        sortable.list(h.ul.class(classes.list).attr("aria-label", options.label)).children(
          ...options.items.map((item) =>
            sortable.item({ element: h.li.class(classes.item), id: item.id }).children(
              sortable
                .handle({ element: h.button.class(classes.handle), id: item.id })
                .attr("aria-label", `Reorder ${item.label}`)
                .children("⠿"),
              item.label
            )
          )
        ),
        sortable.status(h.div.class(classes.status)).children(
          Match.value(sortable.announcement).pipe(
            Match.when(undefined, () => ""),
            Match.orElse((announcement) =>
              [
                getLabel(announcement.id),
                Match.value(announcement).pipe(
                  Match.tag("PickedUp", () => "picked up"),
                  Match.tag("Moved", () => "moved"),
                  Match.tag("Dropped", () => "dropped"),
                  Match.orElse(() => "cancelled")
                ),
                `${announcement.position} of ${announcement.count}`
              ].join(", ")
            )
          )
        )
      )
  }) as Child<Msg>
}
