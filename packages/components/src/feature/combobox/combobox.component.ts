import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Combobox as KitCombobox } from "@effect/ui-kit/Combobox"
import { Field as KitField } from "@effect/ui-kit/Field"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { ComboboxStyle } from "./combobox.component.style.ts"

export const Combobox = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly items: ReadonlyArray<{
      readonly value: string
      readonly label: string
      readonly disabled?: boolean | undefined
    }>
    readonly value: string | null
    readonly inputValue: string
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onPick: (event: { readonly value: string | null }) => NoInfer<Msg> | undefined
    readonly onInput: (event: { readonly inputValue: string }) => NoInfer<Msg> | undefined
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
    props: { disabled: options.disabled, filled: options.value !== null },
    view: (field) =>
      KitCombobox(h, {
        props: {
          open: options.open,
          value: options.value,
          inputValue: options.inputValue,
          items: options.items,
          name: options.name,
          disabled: field.disabled,
          sideOffset: 4
        },
        onEmit: {
          RequestedOpen: () => options.onOpenChange({ open: true }),
          RequestedClose: () => options.onOpenChange({ open: false }),
          Picked: ({ value }) =>
            options.onPick({
              value: Match.value(value).pipe(
                Match.when(Match.string, (picked) => picked),
                Match.orElse(() => null)
              )
            }),
          RequestedInputValue: ({ inputValue }) => options.onInput({ inputValue }),
          Highlighted: () => undefined,
          Settled: () => undefined
        },
        view: (combobox) =>
          field
            .root(h.div.class(classes.root))
            .children(
              field.label(h.label.class(classes.label)).children(options.label),
              combobox
                .inputGroup(h.div.class(classes.group))
                .children(
                  combobox.input(field.control(h.input.class(classes.input))).attr("placeholder", options.placeholder),
                  combobox
                    .clear({ element: h.button.class(classes.button).attr("aria-label", "Clear") })
                    ?.children("×"),
                  combobox.trigger(h.button.class(classes.button)).children(combobox.icon(h.span).children("▾"))
                ),
              combobox
                .positioner(h.div.class(classes.positioner))
                .children(
                  combobox
                    .popup(h.div.class(classes.popup))
                    .children(
                      combobox.empty(h.div.class(classes.empty)).children(options.empty ?? "No results"),
                      combobox
                        .list(h.div.class(classes.list))
                        .children(
                          ...combobox.items.map(({ label, value }) =>
                            combobox
                              .item({ element: h.div.class(classes.item), value })
                              .children(
                                label,
                                combobox
                                  .itemIndicator({ element: h.span.class(classes.indicator), value })
                                  ?.children("✓")
                              )
                          )
                        )
                    )
                )
            )
      })
  }) as Child<Msg>
}
