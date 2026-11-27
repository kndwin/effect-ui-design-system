import * as Kit from "@acme/design-system/Kit"

const FileDropDescriptor = Kit.make({
  name: "FileDrop",
  parts: {
    root: { states: { over: "[data-drag-over]", disabled: "[data-disabled]" } },
    label: { states: {} },
    trigger: { states: { disabled: "[data-disabled]" } },
    hint: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface FileDropParts extends Kit.Type<typeof FileDropDescriptor> {}
export const FileDropParts: FileDropParts = FileDropDescriptor
