import * as Kit from "@acme/design-system/Kit"

const ButtonDescriptor = Kit.make({
  name: "Button",
  parts: {
    root: { states: { disabled: "[data-disabled]", busy: "[aria-busy=true]", pressed: "[aria-pressed=true]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible", "active"]
})

export interface ButtonParts extends Kit.Type<typeof ButtonDescriptor> {}
export const ButtonParts: ButtonParts = ButtonDescriptor
