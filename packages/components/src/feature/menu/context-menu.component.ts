import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { ContextMenu as KitContextMenu } from "@effect/ui-kit/ContextMenu"
import { Html as H } from "@effect/ui/html"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Array, Match } from "effect"
import { ContextMenuStyle } from "./context-menu.component.style.ts"
import { MenuStyle } from "./menu.component.style.ts"
import type { MenuItem } from "./menu.schema.ts"

export const ContextMenu = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onPick: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly items: ReadonlyArray<MenuItem | "separator">
    readonly children: ReadonlyArray<Input<Msg, unknown>> | string
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: MenuStyle, props: {} })
  const area = getStyleClasses({ style: ContextMenuStyle, props: {} })
  const items = Array.filter(options.items, (entry): entry is MenuItem => entry !== "separator")
  const { children } = options
  return KitContextMenu(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open, items: items.map(({ value, label, disabled }) => ({ value, label, disabled })) },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false }),
      Picked: ({ value }) => options.onPick({ value }),
      Highlighted: () => undefined,
      Settled: () => undefined
    },
    view: (menu) =>
      h.div.children(
        menu.trigger(h.div.class(area.area)).children(
          ...Match.value(children).pipe(
            Match.when(Match.string, (text) => [text]),
            Match.orElse((nodes) => nodes)
          )
        ),
        menu.positioner(h.div.class(classes.positioner)).children(
          menu.popup(h.div.class(classes.popup)).children(
            ...options.items.map((entry, index) =>
              Match.value(entry).pipe(
                Match.when("separator", () =>
                  h.div.class(classes.separator).attr("role", "separator").key(`separator-${index}`)
                ),
                Match.orElse(({ value, label, danger }) =>
                  menu
                    .item({
                      element: h.div.class(H.classNames(classes.item, danger === true && classes.dangerItem)),
                      value
                    })
                    .children(label)
                )
              )
            )
          )
        )
      )
  }) as Child<Msg>
}
