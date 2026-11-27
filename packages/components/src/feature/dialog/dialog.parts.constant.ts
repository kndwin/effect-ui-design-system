import * as Kit from "@weft/design-system/Kit"

const transition = { starting: "[data-starting-style]", ending: "[data-ending-style]" }

const DialogDescriptor = Kit.make({
  name: "Dialog",
  parts: {
    backdrop: { states: transition },
    viewport: { states: {} },
    popup: { states: transition },
    header: { states: {} },
    title: { states: {} },
    description: { states: {} },
    body: { states: {} },
    footer: { states: {} },
    close: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface DialogParts extends Kit.Type<typeof DialogDescriptor> {}
export const DialogParts: DialogParts = DialogDescriptor
