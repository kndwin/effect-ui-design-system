import { Accordion } from "@weft/components/accordion"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Questions"
export const order = 1

const questions = [
  ["themes", "Can I write my own theme?", "Yes. A theme fills in every token of the contract; the compiler checks it."],
  ["engine", "Does it need a runtime stylesheet?", "No. Styles compile to static CSS at build time."],
  ["kit", "Which components does it cover?", "Every @effect/ui-kit component, a batch at a time."]
] as const
const Msg = UiSchema.TaggedEnum({ Changed: { value: Schema.Array(Schema.String) } })

export default Html.component({ name: "AccordionFaq", model: Schema.Array(Schema.String), message: Msg }).make({
  init: () => ["themes"],
  update: { Changed: (_, { value }) => value },
  view: (h, value) =>
    Accordion(h, {
      value,
      onValueChange: (event) => Msg.Changed({ value: event.value }),
      items: questions.map(([id, question, answer]) => ({
        value: id,
        title: question,
        content: [Text(h.p).children(answer)]
      }))
    })
})
