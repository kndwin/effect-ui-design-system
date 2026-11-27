import { VStack } from "@weft/components/layout/stack"
import { Switch } from "@weft/components/switch"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Settings"
export const order = 1

const Msg = UiSchema.TaggedEnum({ ToggledEmail: { checked: Schema.Boolean }, ToggledPush: { checked: Schema.Boolean } })

export default Html.component({
  name: "SwitchSettings",
  model: Schema.Struct({ email: Schema.Boolean, push: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ email: true, push: false }),
  update: {
    ToggledEmail: ($, { checked }) => $.evolve({ email: checked }),
    ToggledPush: ($, { checked }) => $.evolve({ push: checked })
  },
  view: (h, { email, push }) =>
    VStack(h.div, { gap: "3" }).children(
      Switch(h, { label: "Email updates", checked: email, onToggle: ({ checked }) => Msg.ToggledEmail({ checked }) }),
      Switch(h, {
        label: "Push notifications",
        checked: push,
        onToggle: ({ checked }) => Msg.ToggledPush({ checked })
      }),
      Switch(h, { label: "SMS (unavailable)", checked: false, disabled: true, onToggle: () => undefined })
    )
})
