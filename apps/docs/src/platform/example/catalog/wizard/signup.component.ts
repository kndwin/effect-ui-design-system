import { Button } from "@weft/components/button"
import { Checkbox } from "@weft/components/checkbox"
import { Field } from "@weft/components/field"
import { Grid } from "@weft/components/layout/grid"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Progress } from "@weft/components/progress"
import { RadioGroup } from "@weft/components/radio-group"
import { Select } from "@weft/components/select"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Schema } from "effect"

export const title = "Workspace setup"
export const order = 1

const TextFieldSchema = Schema.Literals(["email", "password", "workspace", "url"])
type TextField = typeof TextFieldSchema.Type

const Msg = UiSchema.TaggedEnum({
  Updated: { field: TextFieldSchema, value: Schema.String },
  PickedSize: { value: Schema.NullOr(Schema.String) },
  PickedPlan: { value: Schema.String },
  ToggledTerms: { checked: Schema.Boolean },
  PressedBack: {},
  PressedNext: {},
  PressedRestart: {}
})

const steps = ["Account", "Workspace", "Plan", "Review"] as const

const plans = [
  { value: "free", label: "Free: up to 3 people" },
  { value: "team", label: "Team: $8 per person, per month" },
  { value: "business", label: "Business: $16 per person, with SSO" }
]

const ModelSchema = Schema.Struct({
  step: Schema.Number,
  email: Schema.String,
  password: Schema.String,
  workspace: Schema.String,
  url: Schema.String,
  size: Schema.NullOr(Schema.String),
  plan: Schema.String,
  terms: Schema.Boolean,
  attempted: Schema.Boolean,
  done: Schema.Boolean
})
type Model = typeof ModelSchema.Type

const getErrors = (model: Model): Partial<Record<TextField | "terms", string>> =>
  Match.value(model.step).pipe(
    Match.when(0, () => ({
      ...Match.value(model.email.includes("@")).pipe(
        Match.when(true, () => ({})),
        Match.orElse(() => ({ email: "Enter a valid email." }))
      ),
      ...Match.value(model.password.length >= 8).pipe(
        Match.when(true, () => ({})),
        Match.orElse(() => ({ password: "Use at least 8 characters." }))
      )
    })),
    Match.when(1, () =>
      Match.value(model.workspace.trim().length > 0).pipe(
        Match.when(true, () => ({})),
        Match.orElse(() => ({ workspace: "Name your workspace." }))
      )
    ),
    Match.when(3, () =>
      Match.value(model.terms).pipe(
        Match.when(true, () => ({})),
        Match.orElse(() => ({ terms: "Accept the terms to finish." }))
      )
    ),
    Match.orElse(() => ({}))
  )

const initial: Model = {
  step: 0,
  email: "",
  password: "",
  workspace: "",
  url: "",
  size: "2-10",
  plan: "team",
  terms: false,
  attempted: false,
  done: false
}

export default Html.component({ name: "WizardSignup", model: ModelSchema, message: Msg }).make({
  init: () => initial,
  update: {
    Updated: ($, { field, value }) => ({ ...$.model, [field]: value }),
    PickedSize: ($, { value }) => $.evolve({ size: value }),
    PickedPlan: ($, { value }) => $.evolve({ plan: value }),
    ToggledTerms: ($, { checked }) => $.evolve({ terms: checked }),
    PressedBack: ($) => $.evolve({ step: Math.max(0, $.model.step - 1), attempted: false }),
    PressedNext: ($) =>
      Match.value(Object.keys(getErrors($.model)).length === 0).pipe(
        Match.when(false, () => $.evolve({ attempted: true })),
        Match.orElse(() =>
          Match.value($.model.step === steps.length - 1).pipe(
            Match.when(true, () => $.evolve({ done: true })),
            Match.orElse(() => $.evolve({ step: $.model.step + 1, attempted: false }))
          )
        )
      ),
    PressedRestart: () => initial
  },
  view: (h, model) => {
    const errors = Match.value(model.attempted).pipe(
      Match.when(true, () => getErrors(model)),
      Match.orElse(() => ({}) as ReturnType<typeof getErrors>)
    )
    const field = (name: TextField, label: string, type?: string, description?: string) =>
      Field(h, {
        key: name,
        label,
        type,
        description,
        value: model[name],
        invalid: errors[name] !== undefined,
        error: errors[name],
        onUpdate: ({ value }) => Msg.Updated({ field: name, value })
      })
    const review = (label: string, value: string) =>
      HStack(h.div, { justify: "between", gap: "3" }).children(
        Text(h.span, { size: "sm", tone: "muted" }).children(label),
        Text(h.span, { size: "sm", weight: "medium" }).children(value)
      )
    const body = Match.value(model.step).pipe(
      Match.when(0, () => [
        field("email", "Work email", "email"),
        field("password", "Password", "password", "At least 8 characters.")
      ]),
      Match.when(1, () => [
        field("workspace", "Workspace name"),
        field("url", "Workspace URL", "text", "Leave empty to use the name."),
        Select(h, {
          key: "size",
          label: "Team size",
          value: model.size,
          items: [
            { value: "1", label: "Just me" },
            { value: "2-10", label: "2 to 10" },
            { value: "11-50", label: "11 to 50" },
            { value: "51+", label: "More than 50" }
          ],
          onPick: ({ value }) => Msg.PickedSize({ value })
        })
      ]),
      Match.when(2, () => [
        RadioGroup(h, {
          key: "plan",
          label: "Plan",
          value: model.plan,
          items: plans,
          onPick: ({ value }) => Msg.PickedPlan({ value })
        })
      ]),
      Match.orElse(() => [
        review("Email", model.email),
        review("Workspace", model.workspace),
        review("Team size", model.size ?? "Not set"),
        review("Plan", plans.find((p) => p.value === model.plan)?.label.split(":")[0] ?? model.plan),
        Separator(h),
        Checkbox(h, {
          key: "terms",
          label: "I accept the terms of service",
          checked: model.terms,
          onToggle: ({ checked }) => Msg.ToggledTerms({ checked })
        }),
        Match.value(errors.terms).pipe(
          Match.when(undefined, () => h.span),
          Match.orElse((text) => Text(h.p, { size: "sm", tone: "danger" }).attr("role", "alert").children(text))
        )
      ])
    )
    return Section(h.div, { surface: "card", pad: "6", gap: "6" })
      .attr("style", "width:100%;max-width:32rem")
      .children(
        ...Match.value(model.done).pipe(
          Match.when(true, () => [
            VStack(h.div, { gap: "2" }).children(
              Text(h.h2, { size: "xl", weight: "semibold" }).children(`${model.workspace} is ready`),
              Text(h.p, { size: "sm", tone: "muted" }).children(`We sent a confirmation to ${model.email}.`)
            ),
            HStack(h.div, { justify: "end" }).children(
              Button(h, { onPress: Msg.PressedRestart(), children: "Start over" })
            )
          ]),
          Match.orElse(() => [
            VStack(h.div, { gap: "3" }).children(
              Text(h.span, { size: "xs", tone: "muted" }).children(`Step ${model.step + 1} of ${steps.length}`),
              Text(h.h2, { size: "xl", weight: "semibold" }).children(steps[model.step] ?? ""),
              Progress(h, { key: "progress", label: "Setup progress", value: ((model.step + 1) / steps.length) * 100 }),
              Grid(h.ol, { columns: "4", gap: "2" })
                .attr("style", "margin:0;padding:0;list-style:none")
                .children(
                  ...Array.map(steps, (name, index) =>
                    Text(h.li, {
                      size: "xs",
                      weight: Match.value(index === model.step).pipe(
                        Match.when(true, () => "semibold" as const),
                        Match.orElse(() => "regular" as const)
                      ),
                      tone: Match.value(index <= model.step).pipe(
                        Match.when(true, () => "default" as const),
                        Match.orElse(() => "muted" as const)
                      )
                    })
                      .attr(
                        "aria-current",
                        Match.value(index === model.step).pipe(
                          Match.when(true, () => "step"),
                          Match.orElse(() => undefined)
                        )
                      )
                      .children(`${index + 1}. ${name}`)
                  )
                )
            ),
            VStack(h.div, { gap: "4" }).children(...body),
            HStack(h.div, { justify: "between", gap: "2" }).children(
              Button(h, { disabled: model.step === 0, onPress: Msg.PressedBack(), children: "Back" }),
              Button(h, {
                tone: "primary",
                onPress: Msg.PressedNext(),
                children: Match.value(model.step === steps.length - 1).pipe(
                  Match.when(true, () => "Create workspace"),
                  Match.orElse(() => "Next")
                )
              })
            )
          ])
        )
      )
  }
})
