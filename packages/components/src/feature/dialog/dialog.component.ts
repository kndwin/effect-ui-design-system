import { Button } from "../../platform/button/button.component.ts"
import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Dialog as KitDialog } from "@effect/ui-kit/Dialog"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { DialogStyle } from "./dialog.component.style.ts"

export type DialogProps = Style.Props<typeof DialogStyle>

export const Dialog = <Msg>(
  h: Html.H<Msg>,
  options: DialogProps & {
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
  const classes = getStyleClasses({ style: DialogStyle, props: options })
  return KitDialog(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { open: options.open },
    onEmit: {
      RequestedOpen: () => options.onOpenChange({ open: true }),
      RequestedClose: () => options.onOpenChange({ open: false }),
      Settled: () => undefined
    },
    view: (dialog) =>
      h.span.children(
        Button(h, { element: dialog.trigger(h.button), children: options.trigger }),
        dialog.portal(h.dialog)?.children(
          dialog.backdrop(h.div.class(classes.backdrop)),
          dialog.viewport(h.div.class(classes.viewport)).children(
            dialog.popup(h.div.class(classes.popup)).children(
              h.div.class(classes.header).children(
                dialog.title(h.h2.class(classes.title)).children(options.title),
                Match.value(options.description).pipe(
                  Match.when(undefined, () => undefined),
                  Match.orElse((text) => dialog.description(h.p.class(classes.description)).children(text))
                )
              ),
              h.div.class(classes.body).children(...(options.children ?? [])),
              Match.value(options.footer).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((footer) => h.div.class(classes.footer).children(...footer))
              ),
              Button(h, {
                element: dialog.close(h.button.class(classes.close)),
                tone: "ghost",
                size: "sm",
                label: "Close",
                children: "✕"
              })
            )
          )
        )
      )
  }) as Child<Msg>
}
