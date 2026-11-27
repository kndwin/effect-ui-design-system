import * as Kit from "@acme/design-system/Kit"

const CollapsibleDescriptor = Kit.make({
  name: "Collapsible",
  parts: {
    root: { states: {} },
    trigger: { states: { open: "[data-panel-open]", disabled: "[data-disabled]" } },
    icon: { states: {} },
    panel: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface CollapsibleParts extends Kit.Type<typeof CollapsibleDescriptor> {}
export const CollapsibleParts: CollapsibleParts = CollapsibleDescriptor
