import * as Kit from "@acme/design-system/Kit"

const PreviewCardDescriptor = Kit.make({
  name: "PreviewCard",
  parts: {
    trigger: { states: {} },
    positioner: { states: {} },
    popup: { states: { starting: "[data-starting-style]", ending: "[data-ending-style]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface PreviewCardParts extends Kit.Type<typeof PreviewCardDescriptor> {}
export const PreviewCardParts: PreviewCardParts = PreviewCardDescriptor
