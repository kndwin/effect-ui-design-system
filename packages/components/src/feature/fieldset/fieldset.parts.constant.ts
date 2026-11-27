import * as Kit from "@acme/design-system/Kit"

const FieldsetDescriptor = Kit.make({
  name: "Fieldset",
  parts: { root: { states: { disabled: "[data-disabled]" } }, legend: { states: {} } },
  vars: {},
  pseudo: []
})

export interface FieldsetParts extends Kit.Type<typeof FieldsetDescriptor> {}
export const FieldsetParts: FieldsetParts = FieldsetDescriptor
