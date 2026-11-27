import * as Kit from "@acme/design-system/Kit"

const ToolbarDescriptor = Kit.make({
  name: "Toolbar",
  parts: { root: { states: {} }, separator: { states: {} } },
  vars: {},
  pseudo: []
})

export interface ToolbarParts extends Kit.Type<typeof ToolbarDescriptor> {}
export const ToolbarParts: ToolbarParts = ToolbarDescriptor
