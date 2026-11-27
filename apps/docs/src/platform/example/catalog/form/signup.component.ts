import { Button } from "@acme/components/button"
import { Field } from "@acme/components/field"
import { Form } from "@acme/components/form"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Sign-up with validation"
export const order = 1

const Msg = UiSchema.TaggedEnum({ UpdatedEmail: { value: Schema.String }, Submitted: {} })

const getError = (input: { readonly email: string; readonly submitted: boolean }) =>
  Match.value(input).pipe(
    Match.when({ submitted: true, email: (email) => !email.includes("@") }, () => "Enter an email address with an @."),
    Match.orElse(() => undefined)
  )

export default Html.component({
  name: "FormSignup",
  model: Schema.Struct({ email: Schema.String, submitted: Schema.Boolean, sent: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ email: "", submitted: false, sent: false }),
  update: {
    UpdatedEmail: ($, { value }) => $.evolve({ email: value }),
    Submitted: ($) => $.evolve({ submitted: true, sent: $.model.email.includes("@") })
  },
  view: (h, model) => {
    const error = getError(model)
    return Form(h, {
      label: "Sign up",
      onSubmit: () => Msg.Submitted(),
      children: [
        Field(h, {
          label: "Email",
          type: "email",
          value: model.email,
          invalid: error !== undefined,
          error,
          onUpdate: ({ value }) => Msg.UpdatedEmail({ value })
        }),
        Button(h, {
          type: "submit",
          children: Match.value(model.sent).pipe(
            Match.when(true, () => "Sent"),
            Match.orElse(() => "Sign up")
          )
        })
      ]
    })
  }
})
