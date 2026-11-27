import { Button } from "@weft/components/button"
import { HStack } from "@weft/components/layout/stack"
import { Toaster } from "@weft/components/toast"
import { UiSchema } from "@effect/ui"
import { ToastProvider } from "@effect/ui-kit/Toast"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Success and error"
export const order = 1

const Msg = UiSchema.TaggedEnum({ PressedSave: {}, PressedFail: {} })

const Buttons = Html.component({ name: "ToastButtons", model: Schema.Number, message: Msg }).make({
  init: () => 0,
  update: {
    PressedSave: ($) =>
      $.set($.model + 1).send(ToastProvider, {
        _tag: "RequestedAdd",
        toast: { id: `saved-${$.model}`, title: "Saved", description: "Your changes are live.", type: "success" }
      }),
    PressedFail: ($) =>
      $.set($.model + 1).send(ToastProvider, {
        _tag: "RequestedAdd",
        toast: { id: `failed-${$.model}`, title: "Couldn't save", description: "Check your connection.", type: "error" }
      })
  },
  view: (h) =>
    HStack(h.div, { gap: "2", justify: "center" }).children(
      Button(h, { tone: "primary", onPress: Msg.PressedSave(), children: "Save" }),
      Button(h, { tone: "danger", onPress: Msg.PressedFail(), children: "Fail" })
    )
})

export default Html.component({ name: "ToastNotify", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) => Toaster(h, { body: () => Buttons(h, { key: "buttons" }) })
})
