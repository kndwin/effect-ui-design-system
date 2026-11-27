import * as Kit from "@acme/design-system/Kit"

const states = { complete: "[data-complete]", indeterminate: "[data-indeterminate]" }

const ProgressDescriptor = Kit.make({
  name: "Progress",
  parts: {
    root: { states },
    header: { states: {} },
    label: { states: {} },
    value: { states: {} },
    track: { states },
    indicator: { states }
  },
  vars: {},
  pseudo: []
})

export interface ProgressParts extends Kit.Type<typeof ProgressDescriptor> {}
export const ProgressParts: ProgressParts = ProgressDescriptor
