import { RadioGroup } from "@acme/components/radio-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Vertical"
export const order = 1

const plans = [
  { value: "hobby", label: "Hobby" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise (contact us)", disabled: true }
]
const Msg = UiSchema.TaggedEnum({ Picked: { value: Schema.String } })

export default Html.component({ name: "RadioGroupPlans", model: Schema.String, message: Msg }).make({
  init: () => "pro",
  update: { Picked: (_, { value }) => value },
  view: (h, value) =>
    RadioGroup(h, { label: "Plan", value, items: plans, onPick: (event) => Msg.Picked({ value: event.value }) })
})
