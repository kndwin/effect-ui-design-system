import { RangeCalendar } from "@weft/components/range-calendar"
import { VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { DateTime, Match, Schema } from "effect"

export const title = "Pick a stay"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  Picked: { start: Schema.DateTimeUtc, end: Schema.DateTimeUtc },
  ChangedMonth: { month: Schema.DateTimeUtc }
})

const RangeSchema = Schema.Struct({ start: Schema.DateTimeUtc, end: Schema.DateTimeUtc })

export default Html.component({
  name: "RangeCalendarStay",
  model: Schema.Struct({ stay: Schema.NullOr(RangeSchema), month: Schema.DateTimeUtc, today: Schema.DateTimeUtc }),
  message: Msg
}).make({
  init: () => {
    const today = DateTime.removeTime(DateTime.nowUnsafe())
    return {
      stay: { start: DateTime.add(today, { days: 2 }), end: DateTime.add(today, { days: 5 }) },
      month: DateTime.startOf(today, "month"),
      today
    }
  },
  update: {
    Picked: ($, { start, end }) => $.evolve({ stay: { start, end } }),
    ChangedMonth: ($, { month }) => $.evolve({ month })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      RangeCalendar(h, {
        value: model.stay,
        month: model.month,
        today: model.today,
        locale: "en-US",
        onPick: ({ start, end }) => Msg.Picked({ start, end }),
        onMonthChange: ({ month }) => Msg.ChangedMonth({ month })
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(model.stay).pipe(
          Match.when(null, () => "No stay picked."),
          Match.orElse(({ start, end }) => `${DateTime.formatIsoDateUtc(start)} → ${DateTime.formatIsoDateUtc(end)}`)
        )
      )
    )
})
