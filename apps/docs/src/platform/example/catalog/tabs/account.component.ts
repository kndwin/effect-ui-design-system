import { Tabs } from "@acme/components/tabs"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Account settings"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Selected: { value: Schema.String } })

export default Html.component({ name: "TabsAccount", model: Schema.String, message: Msg }).make({
  init: () => "profile",
  update: { Selected: (_, { value }) => value },
  view: (h, value) =>
    Tabs(h, {
      label: "Account",
      value,
      onSelect: (event) => Msg.Selected({ value: event.value }),
      tabs: [
        { value: "profile", label: "Profile", content: [Text(h.p).children("Your name, photo and bio.")] },
        { value: "security", label: "Security", content: [Text(h.p).children("Passwords and two-factor sign-in.")] },
        { value: "billing", label: "Billing", content: [Text(h.p).children("Invoices and payment methods.")] },
        { value: "danger", label: "Danger zone", disabled: true, content: [] }
      ]
    })
})
