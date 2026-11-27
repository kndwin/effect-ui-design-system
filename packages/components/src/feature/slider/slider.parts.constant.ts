import * as Kit from "@acme/design-system/Kit"

const SliderDescriptor = Kit.make({
  name: "Slider",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    control: { states: {} },
    track: { states: {} },
    indicator: { states: {} },
    thumb: { states: { dragging: "[data-dragging]", focus: ":has(:focus-visible)" } }
  },
  vars: {},
  pseudo: ["hover"]
})

export interface SliderParts extends Kit.Type<typeof SliderDescriptor> {}
export const SliderParts: SliderParts = SliderDescriptor
