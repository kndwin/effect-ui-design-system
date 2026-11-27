import { VStack } from "@acme/components/layout/stack"
import { Select } from "@acme/components/select"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Pick one"
export const order = 1

const fruit = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "elderberry", label: "Elderberry" }
]
const Msg = UiSchema.TaggedEnum({ Picked: { value: Schema.NullOr(Schema.String) } })

export default Html.component({ name: "SelectFruit", model: Schema.NullOr(Schema.String), message: Msg }).make({
  init: () => null,
  update: { Picked: (_, { value }) => value },
  view: (h, value) =>
    VStack(h.div, { gap: "3" }).children(
      Select(h, {
        label: "Fruit",
        placeholder: "Choose a fruit",
        value,
        items: fruit,
        onPick: (event) => Msg.Picked({ value: event.value })
      }),
      Text(h.span, { size: "sm", tone: "muted" }).children(`Picked: ${value ?? "nothing yet"}`)
    )
})
