import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Fieldset as KitFieldset } from "@effect/ui-kit/Fieldset"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { FieldsetStyle } from "./fieldset.component.style.ts"

export const Fieldset = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly legend: string
    readonly children: ReadonlyArray<Input<Msg, unknown>>
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: FieldsetStyle, props: {} })
  return KitFieldset(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { disabled: options.disabled },
    view: (fieldset) =>
      fieldset
        .root(h.fieldset.class(classes.root))
        .children(fieldset.legend(h.div.class(classes.legend)).children(options.legend), ...options.children)
  }) as Child<Msg>
}
