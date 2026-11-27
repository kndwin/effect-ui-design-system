import * as Kit from "@weft/design-system/Kit"

const ToggleDescriptor = Kit.make({
  name: "Toggle",
  parts: { root: { states: { pressed: "[data-pressed]", disabled: "[data-disabled]" } } },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface ToggleParts extends Kit.Type<typeof ToggleDescriptor> {}
export const ToggleParts: ToggleParts = ToggleDescriptor
