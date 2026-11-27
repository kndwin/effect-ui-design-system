import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Checkbox as KitCheckbox } from "@effect/ui-kit/Checkbox"
import { CheckboxGroup as KitCheckboxGroup } from "@effect/ui-kit/CheckboxGroup"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { CheckboxStyle } from "./checkbox.component.style.ts"
import { CheckboxGroupStyle } from "./checkbox-group.component.style.ts"

const getIconPath = (indeterminate: boolean) =>
  Match.value(indeterminate).pipe(
    Match.when(true, () => "M6 12h12"),
    Match.orElse(() => "M5 12.5l4.5 4.5L19 7.5")
  )

const viewBox = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly key: string
    readonly label: string
    readonly props: { readonly value?: string; readonly parent?: boolean }
  }
) => {
  const classes = getStyleClasses({ style: CheckboxStyle, props: {} })
  return h.label.class(classes.root).children(
    KitCheckbox(h, {
      key: options.key,
      props: options.props,
      view: (checkbox) =>
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
        )
    }),
    options.label
  )
}

export const CheckboxGroup = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly items: ReadonlyArray<{ readonly value: string; readonly label: string }>
    readonly value: ReadonlyArray<string>
    readonly onUpdate: (event: { readonly value: ReadonlyArray<string> }) => NoInfer<Msg> | undefined
    readonly parentLabel?: string | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: CheckboxGroupStyle, props: {} })
  const members = options.items.map((item) =>
    viewBox(h, { key: item.value, label: item.label, props: { value: item.value } })
  )
  return KitCheckboxGroup(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      value: options.value,
      allValues: options.items.map((item) => item.value),
      name: options.name,
      disabled: options.disabled
    },
    onEmit: { Updated: options.onUpdate },
    view: (group) =>
      group.root(h.div.class(classes.root).attr("aria-label", options.label)).children(
        ...Match.value(options.parentLabel).pipe(
          Match.when(undefined, () => members),
          Match.orElse((text) => [
            viewBox(h, { key: "parent", label: text, props: { parent: true } }),
            h.div.class(classes.items).children(...members)
          ])
        )
      )
  }) as Child<Msg>
}
