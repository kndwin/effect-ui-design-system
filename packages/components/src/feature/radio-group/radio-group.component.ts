import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { RadioGroup as KitRadioGroup } from "@effect/ui-kit/RadioGroup"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { RadioGroupStyle } from "./radio-group.component.style.ts"

export type RadioGroupProps = Style.Props<typeof RadioGroupStyle>

export const RadioGroup = <Msg>(
  h: Html.H<Msg>,
  options: RadioGroupProps & {
    readonly label: string
    readonly value: string | null
    readonly items: ReadonlyArray<{ readonly value: string; readonly label: string; readonly disabled?: boolean }>
    readonly onPick: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly disabled?: boolean | undefined
    readonly name?: string | undefined
    readonly key?: string | undefined
    readonly class?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: RadioGroupStyle, props: options })
  return KitRadioGroup(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      value: options.value,
      items: options.items.map(({ value, disabled }) => ({ value, disabled })),
      disabled: options.disabled,
      name: options.name
    },
    onEmit: { Picked: ({ value }) => options.onPick({ value }) },
    view: (radioGroup) =>
      radioGroup
        .root(h.div.class(classes.root, options.class).attr("aria-label", options.label))
        .children(
          ...options.items.map(({ value, label }) =>
            h.label
              .class(classes.item)
              .children(
                radioGroup
                  .radio({ element: h.button.class(classes.radio), value })
                  .children(radioGroup.indicator({ element: h.span.class(classes.indicator), value })),
                label
              )
          )
        )
  })
}
