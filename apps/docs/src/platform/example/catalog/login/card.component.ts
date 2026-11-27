import { Button } from "@weft/components/button"
import { Checkbox } from "@weft/components/checkbox"
import { Field } from "@weft/components/field"
import { Form } from "@weft/components/form"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Sign-in card"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  UpdatedEmail: { value: Schema.String },
  UpdatedPassword: { value: Schema.String },
  ToggledRemember: { checked: Schema.Boolean },
  Submitted: {}
})

const getEmailError = (email: string) =>
  Match.value(email.includes("@")).pipe(
    Match.when(true, () => undefined),
    Match.orElse(() => "Enter the email you signed up with.")
  )

const getPasswordError = (password: string) =>
  Match.value(password.length >= 8).pipe(
    Match.when(true, () => undefined),
    Match.orElse(() => "Passwords are at least 8 characters.")
  )

export default Html.component({
  name: "LoginCard",
  model: Schema.Struct({
    email: Schema.String,
    password: Schema.String,
    remember: Schema.Boolean,
    submitted: Schema.Boolean
  }),
  message: Msg
}).make({
  init: () => ({ email: "", password: "", remember: true, submitted: false }),
  update: {
    UpdatedEmail: ($, { value }) => $.evolve({ email: value }),
    UpdatedPassword: ($, { value }) => $.evolve({ password: value }),
    ToggledRemember: ($, { checked }) => $.evolve({ remember: checked }),
    Submitted: ($) => $.evolve({ submitted: true })
  },
  view: (h, model) => {
    const shown = <A>(error: A) =>
      Match.value(model.submitted).pipe(
        Match.when(true, () => error),
        Match.orElse(() => undefined)
      )
    const emailError = shown(getEmailError(model.email))
    const passwordError = shown(getPasswordError(model.password))
    const signedIn = model.submitted && emailError === undefined && passwordError === undefined
    return Section(h.div, { surface: "card", pad: "6", gap: "6" })
      .attr("style", "width:100%;max-width:20rem")
      .children(
        VStack(h.div, { gap: "1" }).children(
          Text(h.h2, { size: "xl", weight: "semibold" }).children("Sign in to Weft"),
          Text(h.p, { size: "sm", tone: "muted" }).children("Welcome back. Use your work email.")
        ),
        Form(h, {
          label: "Sign in",
          onSubmit: () => Msg.Submitted(),
          children: [
            Field(h, {
              key: "email",
              label: "Email",
              type: "email",
              placeholder: "ada@example.com",
              value: model.email,
              invalid: emailError !== undefined,
              error: emailError,
              onUpdate: ({ value }) => Msg.UpdatedEmail({ value })
            }),
            Field(h, {
              key: "password",
              label: "Password",
              type: "password",
              value: model.password,
              invalid: passwordError !== undefined,
              error: passwordError,
              onUpdate: ({ value }) => Msg.UpdatedPassword({ value })
            }),
            HStack(h.div, { justify: "between", align: "center", gap: "2", wrap: true }).children(
              Checkbox(h, {
                key: "remember",
                label: "Remember me",
                checked: model.remember,
                onToggle: ({ checked }) => Msg.ToggledRemember({ checked })
              }),
              Text(h.a, { size: "sm", tone: "accent" }).attr("href", "#forgot").children("Forgot password?")
            ),
            Button(h, {
              type: "submit",
              tone: "primary",
              fill: true,
              children: Match.value(signedIn).pipe(
                Match.when(true, () => "Signed in ✓"),
                Match.orElse(() => "Sign in")
              )
            })
          ]
        }),
        HStack(h.div, { gap: "3", align: "center" }).children(
          StackItem(h.div, { grow: true }).children(Separator(h)),
          Text(h.span, { size: "xs", tone: "muted" }).children("or"),
          StackItem(h.div, { grow: true }).children(Separator(h))
        ),
        VStack(h.div, { gap: "2" }).children(
          Button(h, { fill: true, children: "Continue with GitHub" }),
          Button(h, { fill: true, children: "Continue with Google" })
        ),
        Text(h.p, { size: "sm", tone: "muted" }).children(
          "No account yet? ",
          Text(h.a, { size: "sm", tone: "accent" }).attr("href", "#sign-up").children("Create one")
        )
      )
  }
})
