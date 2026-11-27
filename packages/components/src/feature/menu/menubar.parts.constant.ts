import * as Kit from "@weft/design-system/Kit"

const MenubarDescriptor = Kit.make({
  name: "Menubar",
  parts: {
    root: { states: {} },
    trigger: { states: { open: "[data-popup-open]", disabled: "[data-disabled]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface MenubarParts extends Kit.Type<typeof MenubarDescriptor> {}
export const MenubarParts: MenubarParts = MenubarDescriptor
