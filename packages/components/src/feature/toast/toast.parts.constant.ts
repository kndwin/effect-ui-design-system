import * as Kit from "@weft/design-system/Kit"

const ToastDescriptor = Kit.make({
  name: "Toast",
  parts: {
    viewport: { states: {} },
    root: {
      states: {
        starting: "[data-starting-style]",
        ending: "[data-ending-style]",
        success: "[data-type=success]",
        error: "[data-type=error]",
        limited: "[data-limited]"
      }
    },
    title: { states: {} },
    description: { states: {} },
    close: { states: {} }
  },
  vars: {},
  pseudo: []
})

export interface ToastParts extends Kit.Type<typeof ToastDescriptor> {}
export const ToastParts: ToastParts = ToastDescriptor
