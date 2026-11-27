import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { ToastProvider } from "@effect/ui-kit/Toast"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { ToastStyle } from "./toast.component.style.ts"

export const Toaster = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly body: () => Input<Msg, unknown>
    readonly timeout?: number | undefined
    readonly limit?: number | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ToastStyle, props: {} })
  return ToastProvider(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { timeout: options.timeout, limit: options.limit },
    view: (toastProvider) =>
      h.div.children(
        options.body(),
        toastProvider.viewport(h.div.class(classes.viewport)).children(
          ...toastProvider.toasts.map((toast) =>
            toastProvider.root({ element: h.div.class(classes.root), toast }).children(
              Match.value(toast.title).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((text) =>
                  toastProvider.title({ element: h.div.class(classes.title), toast }).children(text)
                )
              ),
              Match.value(toast.description).pipe(
                Match.when(undefined, () => undefined),
                Match.orElse((text) =>
                  toastProvider.description({ element: h.div.class(classes.description), toast }).children(text)
                )
              ),
              Button(h, {
                element: toastProvider.close({ element: h.button.class(classes.close), toast }),
                tone: "ghost",
                size: "sm",
                label: "Dismiss",
                children: "✕"
              })
            )
          )
        )
      )
  }) as Child<Msg>
}
