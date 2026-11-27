import * as Kit from "@acme/design-system/Kit"

const transition = { starting: "[data-starting-style]", ending: "[data-ending-style]", swiping: "[data-swiping]" }

const DrawerDescriptor = Kit.make({
  name: "Drawer",
  parts: {
    backdrop: { states: transition },
    viewport: { states: {} },
    popup: { states: transition },
    title: { states: {} },
    description: { states: {} },
    content: { states: {} },
    footer: { states: {} },
    handle: { states: {} }
  },
  vars: {},
  pseudo: []
})

export interface DrawerParts extends Kit.Type<typeof DrawerDescriptor> {}
export const DrawerParts: DrawerParts = DrawerDescriptor
