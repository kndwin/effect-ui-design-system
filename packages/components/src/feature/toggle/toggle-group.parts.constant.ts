import * as Kit from "@acme/design-system/Kit"

const ToggleGroupDescriptor = Kit.make({
  name: "ToggleGroup",
  parts: {
    root: { states: { vertical: "[data-orientation=vertical]", disabled: "[data-disabled]" } }
  },
  vars: {},
  pseudo: []
})

export interface ToggleGroupParts extends Kit.Type<typeof ToggleGroupDescriptor> {}
export const ToggleGroupParts: ToggleGroupParts = ToggleGroupDescriptor
