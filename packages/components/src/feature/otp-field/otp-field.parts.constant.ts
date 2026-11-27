import * as Kit from "@weft/design-system/Kit"

const OtpFieldDescriptor = Kit.make({
  name: "OtpField",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    slot: { states: { filled: "[data-filled]", invalid: "[data-invalid]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface OtpFieldParts extends Kit.Type<typeof OtpFieldDescriptor> {}
export const OtpFieldParts: OtpFieldParts = OtpFieldDescriptor
