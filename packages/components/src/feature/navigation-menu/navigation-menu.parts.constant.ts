import * as Kit from "@weft/design-system/Kit"

const NavigationMenuDescriptor = Kit.make({
  name: "NavigationMenu",
  parts: {
    root: { states: {} },
    list: { states: {} },
    item: { states: {} },
    link: { states: { active: "[data-active]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface NavigationMenuParts extends Kit.Type<typeof NavigationMenuDescriptor> {}
export const NavigationMenuParts: NavigationMenuParts = NavigationMenuDescriptor
