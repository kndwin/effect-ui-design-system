import * as Kit from "@weft/design-system/Kit"

const DateFieldDescriptor = Kit.make({
  name: "DateField",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    label: { states: {} },
    group: { states: {} },
    input: { states: { invalid: "[aria-invalid=true]", disabled: "[data-disabled]" } },
    trigger: { states: { open: "[data-popup-open]", disabled: "[data-disabled]" } },
    positioner: { states: {} },
    popup: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface DateFieldParts extends Kit.Type<typeof DateFieldDescriptor> {}
export const DateFieldParts: DateFieldParts = DateFieldDescriptor
