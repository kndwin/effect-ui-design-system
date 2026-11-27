import { Checkbox } from "@weft/components/checkbox"
import { VStack } from "@weft/components/layout/stack"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Checked, unchecked and indeterminate"
export const order = 1

const toppings = ["Cheese", "Basil", "Olives"] as const
const Msg = UiSchema.TaggedEnum({ ToggledAll: { checked: Schema.Boolean }, Toggled: { index: Schema.Number } })

export default Html.component({
  name: "CheckboxStates",
  model: Schema.Array(Schema.Boolean),
  message: Msg
}).make({
  init: () => [true, false, false],
  update: {
    ToggledAll: (_, { checked }) => toppings.map(() => checked),
    Toggled: ($, { index }) => $.model.map((checked, at) => checked !== (at === index))
  },
  view: (h, picked) => {
    const count = picked.filter(Boolean).length
    return VStack(h.div, { gap: "3" }).children(
      Checkbox(h, {
        key: "all",
        label: "All toppings",
        checked: count === toppings.length,
        indeterminate: count > 0 && count < toppings.length,
        onToggle: ({ checked }) => Msg.ToggledAll({ checked })
      }),
      ...toppings.map((label, index) =>
        Checkbox(h, {
          key: label,
          label,
          checked: picked[index] === true,
          onToggle: () => Msg.Toggled({ index })
        })
      ),
      Checkbox(h, {
        key: "disabled",
        label: "Pineapple (sold out)",
        checked: false,
        disabled: true,
        onToggle: () => undefined
      })
    )
  }
})
