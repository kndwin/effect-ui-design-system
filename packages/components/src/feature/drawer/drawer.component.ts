import { Button } from "../../platform/button/button.component.ts"
import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Drawer as KitDrawer } from "@effect/ui-kit/Drawer"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { DrawerStyle } from "./drawer.component.style.ts"

export type DrawerProps = Style.Props<typeof DrawerStyle>

const getSwipeDirection = (side: DrawerProps["side"]) =>
  Match.value(side).pipe(
    Match.when("left", () => "left" as const),
    Match.when("bottom", () => "down" as const),
    Match.orElse(() => "right" as const)
  )

export const Drawer = <Msg>(
  h: Html.H<Msg>,
  options: DrawerProps & {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly title: string
    readonly description?: string | undefined
    readonly children?: ReadonlyArray<Input<Msg, unknown>> | undefined
    readonly footer?: ReadonlyArray<Input<Msg, unknown>> | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: DrawerStyle, props: options })
  return KitDrawer(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open, swipeDirection: getSwipeDirection(options.side) },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false }),
      Settled: () => undefined,
      Snapped: () => undefined
    },
    view: (drawer) =>
      h.span.children(
        Button(h, { element: drawer.trigger(h.button), children: options.trigger }),
        drawer.portal(h.dialog)?.children(
          drawer.backdrop(h.div.class(classes.backdrop)),
          drawer.viewport(h.div.class(classes.viewport)).children(
            drawer.popup(h.div.class(classes.popup)).children(
              h.div.class(classes.handle).attr("aria-hidden", "true"),
              drawer.title(h.h2.class(classes.title)).children(options.title),
              Match.value(options.description).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((text) => drawer.description(h.p.class(classes.description)).children(text))
              ),
              drawer.content(h.div.class(classes.content)).children(...(options.children ?? [])),
              h.div
                .class(classes.footer)
                .children(...(options.footer ?? []), Button(h, { element: drawer.close(h.button), children: "Close" }))
            )
          )
        )
      )
  }) as Child<Msg>
}
