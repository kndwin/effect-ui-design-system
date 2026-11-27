import * as Kit from "@acme/design-system/Kit"

const RadioGroupDescriptor = Kit.make({
  name: "RadioGroup",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    item: { states: {} },
    radio: { states: { checked: "[data-checked]", disabled: "[data-disabled]" } },
    indicator: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface RadioGroupParts extends Kit.Type<typeof RadioGroupDescriptor> {}
export const RadioGroupParts: RadioGroupParts = RadioGroupDescriptor
