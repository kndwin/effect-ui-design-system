import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Checkbox as KitCheckbox } from "@effect/ui-kit/Checkbox"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { CheckboxStyle } from "./checkbox.component.style.ts"

const getIconPath = (indeterminate: boolean) =>
  Match.value(indeterminate).pipe(
    Match.when(true, () => "M6 12h12"),
    Match.orElse(() => "M5 12.5l4.5 4.5L19 7.5")
  )

export const Checkbox = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly checked: boolean
    readonly onToggle: (event: { readonly checked: boolean }) => NoInfer<Msg> | undefined
    readonly label?: string | undefined
    readonly indeterminate?: boolean | undefined
    readonly disabled?: boolean | undefined
    readonly name?: string | undefined
    readonly key?: string | undefined
    readonly class?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: CheckboxStyle, props: {} })
  return KitCheckbox(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      checked: options.checked,
      indeterminate: options.indeterminate,
      disabled: options.disabled,
      name: options.name
    },
    onEmit: { Toggled: options.onToggle },
    view: (checkbox) =>
      h.label.class(classes.root, options.class).children(
        checkbox.root(h.button.class(classes.box)).children(
          checkbox.indicator(h.span.class(classes.indicator)).children(
            h.svg
              .attr("viewBox", "0 0 24 24")
              .attr("fill", "none")
              .attr("stroke", "currentColor")
              .attr("stroke-width", "3")
              .attr("stroke-linecap", "round")
              .attr("stroke-linejoin", "round")
              .attr("width", "100%")
              .attr("height", "100%")
              .children(h.path.attr("d", getIconPath(checkbox.indeterminate)))
          )
        ),
        options.label ?? ""
      )
  })
}
