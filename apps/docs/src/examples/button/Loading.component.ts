import { Button } from "@acme/components"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Loading and disabled"
export const order = 3

const Msg = UiSchema.TaggedEnum({ PressedSave: {}, PressedReset: {} })

// `loading` keeps the button focusable (aria-disabled + aria-busy), so focus doesn't jump away.
export default Html.component({ name: "ButtonLoading", model: Schema.Boolean, message: Msg }).make({
  init: () => false,
  update: { PressedSave: () => true, PressedReset: () => false },
  view: (h, saving) =>
    h.div.class("example-row").children(
      Button(h, {
        tone: "primary",
        loading: saving,
        onPress: Msg.PressedSave(),
        children: saving ? "Saving…" : "Save"
      }),
      Button(h, { onPress: Msg.PressedReset(), children: "Reset" }),
      Button(h, { disabled: true, children: "Disabled" })
    )
})
