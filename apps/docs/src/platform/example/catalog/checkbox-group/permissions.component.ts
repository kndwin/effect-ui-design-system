import { CheckboxGroup } from "@acme/components/checkbox-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Permissions with a parent"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Updated: { value: Schema.Array(Schema.String) } })

const items = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "admin", label: "Admin" }
]

export default Html.component({
  name: "CheckboxGroupPermissions",
  model: Schema.Struct({ value: Schema.Array(Schema.String) }),
  message: Msg
}).make({
  init: () => ({ value: ["read"] }),
  update: { Updated: ($, { value }) => $.evolve({ value }) },
  view: (h, { value }) =>
    CheckboxGroup(h, {
      label: "Permissions",
      parentLabel: "All permissions",
      items,
      value,
      onUpdate: (event) => Msg.Updated({ value: event.value })
    })
})
