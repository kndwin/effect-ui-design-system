import * as Kit from "@weft/design-system/Kit"

const CheckboxGroupDescriptor = Kit.make({
  name: "CheckboxGroup",
  parts: { root: { states: { disabled: "[data-disabled]" } }, items: { states: {} } },
  vars: {},
  pseudo: []
})

export interface CheckboxGroupParts extends Kit.Type<typeof CheckboxGroupDescriptor> {}
export const CheckboxGroupParts: CheckboxGroupParts = CheckboxGroupDescriptor
