import * as Kit from "@weft/design-system/Kit"

const states = {
  checked: "[data-checked]",
  indeterminate: "[data-indeterminate]",
  disabled: "[data-disabled]"
}

const CheckboxDescriptor = Kit.make({
  name: "Checkbox",
  parts: { root: { states: {} }, box: { states }, indicator: { states } },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface CheckboxParts extends Kit.Type<typeof CheckboxDescriptor> {}
export const CheckboxParts: CheckboxParts = CheckboxDescriptor
