import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Field as KitField } from "@effect/ui-kit/Field"
import { NumberField as KitNumberField } from "@effect/ui-kit/NumberField"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { NumberFieldStyle } from "./number-field.component.style.ts"

export const NumberField = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: number | null
    readonly onUpdate: (event: { readonly value: number | null }) => NoInfer<Msg> | undefined
    readonly min?: number | undefined
    readonly max?: number | undefined
    readonly step?: number | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: NumberFieldStyle, props: {} })
  return KitField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { disabled: options.disabled },
    view: (field) =>
      KitNumberField(h, {
        props: {
          value: options.value,
          min: options.min,
          max: options.max,
          step: options.step,
          name: options.name,
          disabled: field.disabled
        },
        onEmit: { Updated: ({ value }) => options.onUpdate({ value }), Committed: () => undefined },
        view: (numberField) =>
          numberField
            .root(field.root(h.div.class(classes.root)))
            .children(
              numberField
                .scrubArea({ element: h.span })
                .children(field.label(h.label.class(classes.label)).children(options.label)),
              numberField
                .group(h.div.class(classes.group))
                .children(
                  numberField
                    .decrement({ element: h.button.class(classes.step).attr("aria-label", "Decrease") })
                    .children("−"),
                  numberField.input(field.control(h.input.class(classes.input))),
                  numberField
                    .increment({ element: h.button.class(classes.step).attr("aria-label", "Increase") })
                    .children("+")
                )
            )
      })
  }) as Child<Msg>
}
