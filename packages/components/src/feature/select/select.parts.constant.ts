import * as Kit from "@acme/design-system/Kit"

const SelectDescriptor = Kit.make({
  name: "Select",
  parts: {
    root: { states: {} },
    trigger: { states: { open: "[data-popup-open]", placeholder: "[data-placeholder]", disabled: "[data-disabled]" } },
    value: { states: {} },
    icon: { states: {} },
    positioner: { states: {} },
    popup: { states: {} },
    item: { states: { highlighted: "[data-highlighted]", selected: "[data-selected]", disabled: "[data-disabled]" } },
    indicator: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface SelectParts extends Kit.Type<typeof SelectDescriptor> {}
export const SelectParts: SelectParts = SelectDescriptor
