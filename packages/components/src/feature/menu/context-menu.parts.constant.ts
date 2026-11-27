import * as Kit from "@weft/design-system/Kit"

const ContextMenuDescriptor = Kit.make({
  name: "ContextMenu",
  parts: { area: { states: { open: "[data-popup-open]" } } },
  vars: {},
  pseudo: []
})

export interface ContextMenuParts extends Kit.Type<typeof ContextMenuDescriptor> {}
export const ContextMenuParts: ContextMenuParts = ContextMenuDescriptor
