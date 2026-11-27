import * as Kit from "@acme/design-system/Kit"

const InputDescriptor = Kit.make({
  name: "Input",
  parts: { root: { states: { disabled: "[data-disabled]", invalid: "[aria-invalid=true]" } } },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface InputParts extends Kit.Type<typeof InputDescriptor> {}
export const InputParts: InputParts = InputDescriptor
