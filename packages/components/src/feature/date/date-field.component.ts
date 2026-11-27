import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { DateField as KitDateField } from "@effect/ui-kit/DateField"
import { Field as KitField } from "@effect/ui-kit/Field"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { type DateTime, Match } from "effect"
import { DateFieldStyle } from "./date-field.component.style.ts"

export const DateField = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: DateTime.DateTime | null
    readonly onCommit: (event: { readonly date: DateTime.Utc | null }) => NoInfer<Msg> | undefined
    readonly locale?: string | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: DateFieldStyle, props: {} })
  return KitField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { disabled: options.disabled },
    view: (field) =>
      KitDateField(h, {
        props: { value: options.value, locale: options.locale, name: options.name, disabled: field.disabled },
        onEmit: { Committed: ({ date }) => options.onCommit({ date }) },
        view: (dateField) =>
          field
            .root(h.div.class(classes.root))
            .children(
              field.label(h.label.class(classes.label)).children(options.label),
              dateField.input(field.control(h.input.class(classes.input))).attr("placeholder", dateField.pattern)
            )
      })
  }) as Child<Msg>
}
