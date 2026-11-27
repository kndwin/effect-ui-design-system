import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { NavigationMenu as KitNavigationMenu } from "@effect/ui-kit/NavigationMenu"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { NavigationMenuStyle } from "./navigation-menu.component.style.ts"

export type NavigationMenuProps = Style.Props<typeof NavigationMenuStyle>

export const NavigationMenu = <Msg>(
  h: Html.H<Msg>,
  options: NavigationMenuProps & {
    readonly label: string
    readonly links: ReadonlyArray<{ readonly href: string; readonly label: string; readonly active?: boolean }>
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: NavigationMenuStyle, props: options })
  return KitNavigationMenu(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { orientation: options.orientation ?? "horizontal" },
    view: (navigationMenu) =>
      navigationMenu
        .root(h.nav.class(classes.root).attr("aria-label", options.label))
        .children(
          navigationMenu
            .list(h.ul.class(classes.list))
            .children(
              ...options.links.map(({ href, label, active }) =>
                navigationMenu
                  .item(h.li.class(classes.item).key(href))
                  .children(
                    navigationMenu
                      .link({ element: h.a.class(classes.link).attr("href", href), active: active === true })
                      .children(label)
                  )
              )
            )
        )
  }) as Child<Msg>
}
