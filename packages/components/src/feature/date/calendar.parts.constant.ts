import * as Kit from "@acme/design-system/Kit"

const CalendarDescriptor = Kit.make({
  name: "Calendar",
  parts: {
    root: { states: { disabled: "[data-disabled]" } },
    header: { states: {} },
    heading: { states: {} },
    nav: { states: { disabled: "[data-disabled]" } },
    grid: { states: {} },
    weekday: { states: {} },
    cell: { states: {} },
    day: {
      states: {
        selected: "[data-selected]",
        today: "[data-today]",
        outside: "[data-outside-month]",
        unavailable: "[data-unavailable]",
        disabled: "[data-disabled]",
        rangeStart: "[data-range-start]",
        rangeEnd: "[data-range-end]",
        inRange: "[data-in-range]"
      }
    }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface CalendarParts extends Kit.Type<typeof CalendarDescriptor> {}
export const CalendarParts: CalendarParts = CalendarDescriptor
