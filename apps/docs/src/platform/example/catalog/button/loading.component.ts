import { Button } from "@acme/components/button"
import { UiSchema } from "@effect/ui"
import { HStack } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Loading and disabled"
export const order = 3

const Msg = UiSchema.TaggedEnum({ PressedSave: {}, PressedReset: {} })

export default Html.component({ name: "ButtonLoading", model: Schema.Boolean, message: Msg }).make({
  init: () => false,
  update: { PressedSave: () => true, PressedReset: () => false },
  view: (h, saving) =>
    HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
      Button(h, {
        tone: "primary",
        loading: saving,
        onPress: Msg.PressedSave(),
        children: Match.value(saving).pipe(
          Match.when(true, () => "Saving…"),
          Match.orElse(() => "Save")
        )
      }),
      Button(h, { onPress: Msg.PressedReset(), children: "Reset" }),
      Button(h, { disabled: true, children: "Disabled" })
    )
})
