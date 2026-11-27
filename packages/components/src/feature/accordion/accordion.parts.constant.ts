import * as Kit from "@acme/design-system/Kit"

const AccordionDescriptor = Kit.make({
  name: "Accordion",
  parts: {
    root: { states: {} },
    item: { states: { open: "[data-open]" } },
    header: { states: {} },
    trigger: { states: { open: "[data-panel-open]", disabled: "[data-disabled]" } },
    icon: { states: {} },
    panel: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } },
    content: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface AccordionParts extends Kit.Type<typeof AccordionDescriptor> {}
export const AccordionParts: AccordionParts = AccordionDescriptor
