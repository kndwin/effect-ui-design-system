import { Combobox } from "@weft/components/combobox"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Pick a fruit"
export const order = 1

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "pear", label: "Pear" }
]

const Msg = UiSchema.TaggedEnum({
  ChangedOpen: { open: Schema.Boolean },
  Picked: { value: Schema.NullOr(Schema.String) },
  Typed: { inputValue: Schema.String }
})

export default Html.component({
  name: "ComboboxFruit",
  model: Schema.Struct({ open: Schema.Boolean, value: Schema.NullOr(Schema.String), inputValue: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: false, value: null, inputValue: "" }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    Picked: ($, { value }) => $.evolve({ value }),
    Typed: ($, { inputValue }) => $.evolve({ inputValue })
  },
  view: (h, model) =>
    Combobox(h, {
      label: "Fruit",
      placeholder: "Search fruit",
      items: fruits,
      value: model.value,
      inputValue: model.inputValue,
      open: model.open,
      onOpenChange: ({ open }) => Msg.ChangedOpen({ open }),
      onPick: ({ value }) => Msg.Picked({ value }),
      onInput: ({ inputValue }) => Msg.Typed({ inputValue })
    })
})
