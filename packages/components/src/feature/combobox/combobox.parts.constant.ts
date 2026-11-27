import * as Kit from "@weft/design-system/Kit"

const ComboboxDescriptor = Kit.make({
  name: "Combobox",
  parts: {
    root: { states: {} },
    label: { states: {} },
    group: { states: { focused: ":focus-within", disabled: "[data-disabled]" } },
    input: { states: {} },
    button: { states: {} },
    positioner: { states: {} },
    popup: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } },
    list: { states: {} },
    empty: { states: { blank: ":empty" } },
    item: { states: { highlighted: "[data-highlighted]", selected: "[data-selected]", disabled: "[data-disabled]" } },
    indicator: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface ComboboxParts extends Kit.Type<typeof ComboboxDescriptor> {}
export const ComboboxParts: ComboboxParts = ComboboxDescriptor
