import { Field } from "@weft/components/field"
import { VStack } from "@weft/components/layout/stack"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Label, description and error"
export const order = 1

const Msg = UiSchema.TaggedEnum({ UpdatedName: { value: Schema.String }, UpdatedEmail: { value: Schema.String } })

export default Html.component({
  name: "FieldProfile",
  model: Schema.Struct({ name: Schema.String, email: Schema.String }),
  message: Msg
}).make({
  init: () => ({ name: "Ada Lovelace", email: "ada@" }),
  update: {
    UpdatedName: ($, { value }) => $.evolve({ name: value }),
    UpdatedEmail: ($, { value }) => $.evolve({ email: value })
  },
  view: (h, { name, email }) =>
    VStack(h.div, { gap: "4" }).children(
      Field(h, {
        key: "name",
        label: "Name",
        description: "Shown on your profile.",
        value: name,
        onUpdate: ({ value }) => Msg.UpdatedName({ value })
      }),
      Field(h, {
        key: "email",
        label: "Email",
        type: "email",
        value: email,
        invalid: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),
        error: "Enter an email address like ada@example.com",
        onUpdate: ({ value }) => Msg.UpdatedEmail({ value })
      })
    )
})
