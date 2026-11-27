import * as Kit from "@acme/design-system/Kit"

const PopoverDescriptor = Kit.make({
  name: "Popover",
  parts: {
    positioner: { states: {} },
    popup: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } },
    title: { states: {} },
    description: { states: {} },
    body: { states: {} }
  },
  vars: {},
  pseudo: []
})

export interface PopoverParts extends Kit.Type<typeof PopoverDescriptor> {}
export const PopoverParts: PopoverParts = PopoverDescriptor
