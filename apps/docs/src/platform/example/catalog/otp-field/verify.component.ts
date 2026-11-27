import { OtpField } from "@acme/components/otp-field"
import { Text } from "@acme/components/text"
import { VStack } from "@acme/components/layout/stack"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Redacted, Schema } from "effect"

export const title = "Verification code"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  Updated: { value: Schema.Redacted(Schema.String) },
  Completed: {}
})

export default Html.component({
  name: "OtpFieldVerify",
  model: Schema.Struct({ code: Schema.Redacted(Schema.String), complete: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ code: Redacted.make(""), complete: false }),
  update: {
    Updated: ($, { value }) => $.evolve({ code: value, complete: false }),
    Completed: ($) => $.evolve({ complete: true })
  },
  view: (h, { code, complete }) =>
    VStack(h.div, { gap: "3" }).children(
      OtpField(h, {
        label: "Verification code",
        value: code,
        onUpdate: ({ value }) => Msg.Updated({ value }),
        onComplete: () => Msg.Completed()
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(complete).pipe(
          Match.when(true, () => "Code complete."),
          Match.orElse(() => "Enter the six digits we sent you.")
        )
      )
    )
})
