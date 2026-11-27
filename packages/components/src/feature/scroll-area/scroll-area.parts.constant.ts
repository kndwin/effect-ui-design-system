import * as Kit from "@acme/design-system/Kit"

const ScrollAreaDescriptor = Kit.make({
  name: "ScrollArea",
  parts: {
    root: { states: {} },
    viewport: { states: {} },
    content: { states: {} },
    scrollbar: { states: { scrolling: "[data-scrolling]", hovering: "[data-hovering]" } },
    thumb: { states: {} }
  },
  vars: {},
  pseudo: ["hover"]
})

export interface ScrollAreaParts extends Kit.Type<typeof ScrollAreaDescriptor> {}
export const ScrollAreaParts: ScrollAreaParts = ScrollAreaDescriptor
