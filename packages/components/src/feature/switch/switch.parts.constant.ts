import * as Kit from "@acme/design-system/Kit"

const states = { checked: "[data-checked]", disabled: "[data-disabled]" }

const SwitchDescriptor = Kit.make({
  name: "Switch",
  parts: { root: { states: {} }, track: { states }, thumb: { states } },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface SwitchParts extends Kit.Type<typeof SwitchDescriptor> {}
export const SwitchParts: SwitchParts = SwitchDescriptor
