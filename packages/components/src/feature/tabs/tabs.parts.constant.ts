import * as Kit from "@weft/design-system/Kit"

const TabsDescriptor = Kit.make({
  name: "Tabs",
  parts: {
    root: { states: {} },
    list: { states: {} },
    tab: { states: { active: "[data-active]", disabled: "[data-disabled]" } },
    indicator: { states: {} },
    panel: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface TabsParts extends Kit.Type<typeof TabsDescriptor> {}
export const TabsParts: TabsParts = TabsDescriptor
