import { Calendar } from "@weft/components/calendar"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { DateTime, Match, Schema } from "effect"

export const title = "Pick a day"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Picked: { date: Schema.DateTimeUtc }, ChangedMonth: { month: Schema.DateTimeUtc } })

export default Html.component({
  name: "CalendarBooking",
  model: Schema.Struct({
    date: Schema.NullOr(Schema.DateTimeUtc),
    month: Schema.DateTimeUtc,
    today: Schema.DateTimeUtc
  }),
  message: Msg
}).make({
  init: () => {
    const today = DateTime.removeTime(DateTime.nowUnsafe())
    return { date: null, month: DateTime.startOf(today, "month"), today }
  },
  update: {
    Picked: ($, { date }) => $.evolve({ date }),
    ChangedMonth: ($, { month }) => $.evolve({ month })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      Calendar(h, {
        value: model.date,
        month: model.month,
        today: model.today,
        locale: "en-US",
        onPick: ({ date }) => Msg.Picked({ date }),
        onMonthChange: ({ month }) => Msg.ChangedMonth({ month })
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(model.date).pipe(
          Match.when(null, () => "No day picked."),
          Match.orElse((date) => `Picked ${DateTime.formatIsoDateUtc(date)}`)
        )
      )
    )
})
