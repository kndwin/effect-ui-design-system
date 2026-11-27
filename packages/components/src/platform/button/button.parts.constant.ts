import * as Kit from "@weft/design-system/Kit"

const ButtonDescriptor = Kit.make({
  name: "Button",
  parts: {
    root: {
      states: {
        disabled: "[data-disabled]",
        busy: "[aria-busy=true]",
        pressed: "[aria-pressed=true]",
        current: "[aria-current=page]"
      }
    }
  },
  vars: {},
  pseudo: ["hover", "focusVisible", "active"]
})

export interface ButtonParts extends Kit.Type<typeof ButtonDescriptor> {}
export const ButtonParts: ButtonParts = ButtonDescriptor
