import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Field as KitField } from "@effect/ui-kit/Field"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { Input } from "./input.component.ts"
import { FieldStyle } from "./field.component.style.ts"

export type FieldProps = Style.Props<typeof FieldStyle>

export const Field = <Msg>(
  h: Html.H<Msg>,
  options: FieldProps & {
    readonly label: string
    readonly value: string
    readonly onUpdate: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly description?: string | undefined
    readonly error?: string | undefined
    readonly invalid?: boolean | undefined
    readonly disabled?: boolean | undefined
    readonly placeholder?: string | undefined
    readonly type?: string | undefined
    readonly key?: string | undefined
    readonly class?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: FieldStyle, props: options })
  return KitField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      invalid: options.invalid,
      disabled: options.disabled,
      filled: options.value !== "",
      described: options.description !== undefined
    },
    view: (field) =>
      field.root(h.div.class(classes.root, options.class)).children(
        field.label(h.label.class(classes.label)).children(options.label),
        Input(h, {
          element: field.control(h.input),
          value: options.value,
          onUpdate: options.onUpdate,
          placeholder: options.placeholder
        }).attr("type", options.type),
        Match.value(options.description).pipe(
          Match.when(undefined, () => undefined),
          Match.orElse((text) => field.description(h.p.class(classes.description)).children(text))
        ),
        field.error(h.div.class(classes.error))?.children(options.error ?? "")
      )
  })
}
