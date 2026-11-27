import { DateField } from "@weft/components/date-field"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { DateTime, Match, Schema } from "effect"

export const title = "Event date"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Committed: { date: Schema.NullOr(Schema.DateTimeUtc) } })

export default Html.component({
  name: "DateFieldEvent",
  model: Schema.Struct({ date: Schema.NullOr(Schema.DateTimeUtc) }),
  message: Msg
}).make({
  init: () => ({ date: DateTime.removeTime(DateTime.nowUnsafe()) }),
  update: { Committed: ($, { date }) => $.evolve({ date }) },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      DateField(h, {
        label: "Event date",
        value: model.date,
        locale: "en-GB",
        onCommit: ({ date }) => Msg.Committed({ date })
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(model.date).pipe(
          Match.when(null, () => "No date."),
          Match.orElse((date) => `Stored as ${DateTime.formatIsoDateUtc(date)}`)
        )
      )
    )
})
