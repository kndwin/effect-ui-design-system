import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Menu as KitMenu } from "@effect/ui-kit/Menu"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Html as H } from "@effect/ui/html"
import { Array, Match } from "effect"
import { MenuStyle } from "./menu.component.style.ts"
import type { MenuItem } from "./menu.schema.ts"

export const Menu = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onPick: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly items: ReadonlyArray<MenuItem | "separator">
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: MenuStyle, props: {} })
  const items = Array.filter(options.items, (entry): entry is MenuItem => entry !== "separator")
  return KitMenu(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      open: options.open,
      items: items.map(({ value, label, disabled }) => ({ value, label, disabled })),
      sideOffset: 4,
      align: "start"
    },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false }),
      Picked: ({ value }) => options.onPick({ value }),
      Highlighted: () => undefined,
      RequestedQuery: () => undefined,
      Settled: () => undefined
    },
    view: (menu) =>
      h.span.children(
        Button(h, { element: menu.trigger({ element: h.button }), children: [options.trigger, " ▾"] }),
        menu.positioner(h.div.class(classes.positioner)).children(
          menu.popup(h.div.class(classes.popup)).children(
            ...options.items.map((entry, index) =>
              Match.value(entry).pipe(
                Match.when("separator", () => menu.separator(h.div.class(classes.separator).key(`separator-${index}`))),
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
