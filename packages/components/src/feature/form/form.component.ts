import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Form as KitForm } from "@effect/ui-kit/Form"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { FormStyle } from "./form.component.style.ts"

export const Form = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly onSubmit: () => NoInfer<Msg> | undefined
    readonly children: ReadonlyArray<Input<Msg, unknown>>
    readonly label?: string | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: FormStyle, props: {} })
  return KitForm(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    onEmit: () => options.onSubmit(),
    view: (form) =>
      form.root(h.form.class(classes.root).attr("aria-label", options.label)).children(...options.children)
  }) as Child<Msg>
}
