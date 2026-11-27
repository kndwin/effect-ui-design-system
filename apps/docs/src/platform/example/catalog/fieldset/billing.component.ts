import { Field } from "@weft/components/field"
import { Fieldset } from "@weft/components/fieldset"
import { Switch } from "@weft/components/switch"
import { VStack } from "@weft/components/layout/stack"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Lockable billing details"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  ToggledLocked: { checked: Schema.Boolean },
  UpdatedCompany: { value: Schema.String },
  UpdatedTaxId: { value: Schema.String }
})

export default Html.component({
  name: "FieldsetBilling",
  model: Schema.Struct({ locked: Schema.Boolean, company: Schema.String, taxId: Schema.String }),
  message: Msg
}).make({
  init: () => ({ locked: false, company: "Acme", taxId: "" }),
  update: {
    ToggledLocked: ($, { checked }) => $.evolve({ locked: checked }),
    UpdatedCompany: ($, { value }) => $.evolve({ company: value }),
    UpdatedTaxId: ($, { value }) => $.evolve({ taxId: value })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "4" }).children(
      Switch(h, {
        label: "Lock billing",
        checked: model.locked,
        onToggle: ({ checked }) => Msg.ToggledLocked({ checked })
      }),
      Fieldset(h, {
        legend: "Billing details",
        disabled: model.locked,
        children: [
          Field(h, {
            key: "company",
            label: "Company",
            value: model.company,
            onUpdate: ({ value }) => Msg.UpdatedCompany({ value })
          }),
          Field(h, {
            key: "tax",
            label: "Tax ID",
            value: model.taxId,
            onUpdate: ({ value }) => Msg.UpdatedTaxId({ value })
          })
        ]
      })
    )
})
