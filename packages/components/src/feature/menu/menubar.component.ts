import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Menu as KitMenu } from "@effect/ui-kit/Menu"
import { Menubar as KitMenubar } from "@effect/ui-kit/Menubar"
import { Html as H } from "@effect/ui/html"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Match } from "effect"
import { MenuStyle } from "./menu.component.style.ts"
import { MenubarStyle } from "./menubar.component.style.ts"
import type { MenuItem } from "./menu.schema.ts"

export const Menubar = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly menus: ReadonlyArray<{ readonly name: string; readonly items: ReadonlyArray<MenuItem | "separator"> }>
    readonly open: string | null
    readonly onOpenChange: (event: { readonly menu: string; readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onPick: (event: { readonly menu: string; readonly value: string }) => NoInfer<Msg> | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: MenuStyle, props: {} })
  const bar = getStyleClasses({ style: MenubarStyle, props: {} })
  return KitMenubar(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {},
    view: (menubar) =>
      menubar.root(h.div.class(bar.root).attr("aria-label", options.label)).children(
        ...options.menus.map(({ name, items }) =>
          KitMenu(h, {
            key: name,
            props: {
              open: options.open === name,
              items: Array.filter(items, (entry): entry is MenuItem => entry !== "separator").map(
                ({ value, label, disabled }) => ({ value, label, disabled })
              ),
              sideOffset: 4,
              align: "start"
            },
            onEmit: {
              RequestedOpen: () => options.onOpenChange({ menu: name, open: true }),
              RequestedClose: () => options.onOpenChange({ menu: name, open: false }),
              Picked: ({ value }) => options.onPick({ menu: name, value }),
              Highlighted: () => undefined,
              RequestedQuery: () => undefined,
              Settled: () => undefined
            },
            view: (menu) =>
              h.div.children(
                menu.trigger({ element: h.button.class(bar.trigger) }).children(name),
                menu.positioner(h.div.class(classes.positioner)).children(
                  menu.popup(h.div.class(classes.popup)).children(
                    ...items.map((entry, index) =>
                      Match.value(entry).pipe(
                        Match.when("separator", () =>
                          menu.separator(h.div.class(classes.separator).key(`separator-${index}`))
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
          })
        )
      )
  }) as Child<Msg>
}
