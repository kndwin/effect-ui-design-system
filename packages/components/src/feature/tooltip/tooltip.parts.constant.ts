import * as Kit from "@weft/design-system/Kit"

const TooltipDescriptor = Kit.make({
  name: "Tooltip",
  parts: { positioner: { states: {} }, popup: { states: { open: "[data-open]" } } },
  vars: {},
  pseudo: []
})

export interface TooltipParts extends Kit.Type<typeof TooltipDescriptor> {}
export const TooltipParts: TooltipParts = TooltipDescriptor
