import * as Kit from "@weft/design-system/Kit"

const MenuDescriptor = Kit.make({
  name: "Menu",
  parts: {
    positioner: { states: {} },
    popup: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } },
    item: { states: { highlighted: "[data-highlighted]", disabled: "[data-disabled]" } },
    separator: { states: {} }
  },
  vars: {},
  pseudo: []
})

export interface MenuParts extends Kit.Type<typeof MenuDescriptor> {}
export const MenuParts: MenuParts = MenuDescriptor
