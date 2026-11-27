import * as Kit from "@weft/design-system/Kit"

const SortableListDescriptor = Kit.make({
  name: "SortableList",
  parts: {
    list: { states: { disabled: "[data-disabled]" } },
    item: {
      states: {
        moving: "[data-moving]",
        dropBefore: "[data-drop-position=before]",
        dropAfter: "[data-drop-position=after]"
      }
    },
    label: { states: {} },
    handle: { states: { moving: "[data-moving]", disabled: "[data-disabled]" } },
    status: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface SortableListParts extends Kit.Type<typeof SortableListDescriptor> {}
export const SortableListParts: SortableListParts = SortableListDescriptor
