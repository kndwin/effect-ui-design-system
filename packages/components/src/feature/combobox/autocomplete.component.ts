import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Autocomplete as KitAutocomplete } from "@effect/ui-kit/Autocomplete"
import { Field as KitField } from "@effect/ui-kit/Field"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { ComboboxStyle } from "./combobox.component.style.ts"

export const Autocomplete = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly items: ReadonlyArray<{ readonly value: string; readonly label: string }>
    readonly value: string
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onUpdate: (event: { readonly value: string }) => NoInfer<Msg> | undefined
    readonly placeholder?: string | undefined
    readonly empty?: string | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ComboboxStyle, props: {} })
  return KitField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { disabled: options.disabled, filled: options.value !== "" },
    view: (field) =>
      KitAutocomplete(h, {
        props: {
          open: options.open,
          value: options.value,
          items: options.items,
          name: options.name,
          disabled: field.disabled,
          sideOffset: 4
        },
        onEmit: {
          RequestedOpen: () => options.onOpenChange({ open: true }),
          RequestedClose: () => options.onOpenChange({ open: false }),
          Updated: ({ value }) => options.onUpdate({ value }),
          Highlighted: () => undefined,
          Settled: () => undefined
        },
        view: (autocomplete) =>
          field
            .root(h.div.class(classes.root))
            .children(
              field.label(h.label.class(classes.label)).children(options.label),
              autocomplete
                .inputGroup(h.div.class(classes.group))
                .children(
                  autocomplete
                    .input(field.control(h.input.class(classes.input)))
                    .attr("placeholder", options.placeholder),
                  autocomplete
                    .clear({ element: h.button.class(classes.button).attr("aria-label", "Clear") })
                    ?.children("×")
                ),
              autocomplete
                .positioner(h.div.class(classes.positioner))
                .children(
                  autocomplete
                    .popup(h.div.class(classes.popup))
                    .children(
                      autocomplete.empty(h.div.class(classes.empty)).children(options.empty ?? "No suggestions"),
                      autocomplete
                        .list(h.div.class(classes.list))
                        .children(
                          ...autocomplete.items.map(({ label, value }) =>
                            autocomplete.item({ element: h.div.class(classes.item), value }).children(label)
                          )
                        )
                    )
                )
            )
      })
  }) as Child<Msg>
}
