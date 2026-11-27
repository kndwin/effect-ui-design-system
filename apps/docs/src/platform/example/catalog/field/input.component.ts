import { Input } from "@acme/components/input"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Input on its own"
export const order = 2

const Msg = UiSchema.TaggedEnum({ Updated: { value: Schema.String } })

export default Html.component({ name: "InputAlone", model: Schema.String, message: Msg }).make({
  init: () => "",
  update: { Updated: (_, { value }) => value },
  view: (h, value) =>
    VStack(h.div, { gap: "2" }).children(
      Input(h, {
        value,
        label: "Search",
        placeholder: "Search…",
        size: "sm",
        onUpdate: (event) => Msg.Updated({ value: event.value })
      }),
      Text(h.span, { size: "sm", tone: "muted" }).children(`${value.length} characters`)
    )
})
