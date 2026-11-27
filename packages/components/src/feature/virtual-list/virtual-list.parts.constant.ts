import * as Kit from "@acme/design-system/Kit"

const VirtualListDescriptor = Kit.make({
  name: "VirtualList",
  parts: { viewport: { states: {} }, list: { states: {} }, item: { states: {} } },
  vars: {},
  pseudo: ["focusVisible"]
})

export interface VirtualListParts extends Kit.Type<typeof VirtualListDescriptor> {}
export const VirtualListParts: VirtualListParts = VirtualListDescriptor
