import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { AlertDialog as KitAlertDialog } from "@effect/ui-kit/AlertDialog"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { DialogStyle } from "./dialog.component.style.ts"

export const AlertDialog = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly trigger: string
    readonly title: string
    readonly description: string
    readonly confirm: string
    readonly onConfirm: NoInfer<Msg>
    readonly cancel?: string | undefined
    readonly tone?: "primary" | "danger" | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: DialogStyle, props: { size: "sm" } })
  return KitAlertDialog(h, {
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
    view: (alertDialog) =>
      h.span.children(
        Button(h, {
          element: alertDialog.trigger(h.button),
          tone: options.tone ?? "danger",
          children: options.trigger
        }),
        alertDialog.portal(h.dialog)?.children(
          alertDialog.backdrop(h.div.class(classes.backdrop)),
          alertDialog.viewport(h.div.class(classes.viewport)).children(
            alertDialog.popup(h.div.class(classes.popup)).children(
              h.div
                .class(classes.header)
                .children(
                  alertDialog.title(h.h2.class(classes.title)).children(options.title),
                  alertDialog.description(h.p.class(classes.description)).children(options.description)
                ),
              h.div.class(classes.footer).children(
                Button(h, {
                  element: alertDialog.initialFocus(alertDialog.close(h.button)),
                  children: options.cancel ?? "Cancel"
                }),
                Button(h, { tone: options.tone ?? "danger", onPress: options.onConfirm, children: options.confirm })
              )
            )
          )
        )
      )
  }) as Child<Msg>
}
