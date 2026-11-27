import * as Kit from "@weft/design-system/Kit"

const NumberFieldDescriptor = Kit.make({
  name: "NumberField",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    label: { states: {} },
    group: { states: { focused: "[data-focused]", invalid: "[data-invalid]" } },
    input: { states: {} },
    step: { states: { disabled: "[data-disabled]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface NumberFieldParts extends Kit.Type<typeof NumberFieldDescriptor> {}
export const NumberFieldParts: NumberFieldParts = NumberFieldDescriptor
