import * as Kit from "@acme/design-system/Kit"

const FieldDescriptor = Kit.make({
  name: "Field",
  parts: {
    root: { states: { disabled: "[data-disabled]", invalid: "[data-invalid]" } },
    label: { states: {} },
    description: { states: {} },
    error: { states: {} }
  },
  vars: {},
  pseudo: []
})

export interface FieldParts extends Kit.Type<typeof FieldDescriptor> {}
export const FieldParts: FieldParts = FieldDescriptor
