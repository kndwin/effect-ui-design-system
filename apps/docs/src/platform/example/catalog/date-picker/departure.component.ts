import { DatePicker } from "@acme/components/date-picker"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { DateTime, Schema } from "effect"

export const title = "Departure"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  Picked: { date: Schema.NullOr(Schema.DateTimeUtc) },
  ChangedOpen: { open: Schema.Boolean },
  ChangedMonth: { month: Schema.DateTimeUtc }
})

export default Html.component({
  name: "DatePickerDeparture",
  model: Schema.Struct({
    date: Schema.NullOr(Schema.DateTimeUtc),
    month: Schema.DateTimeUtc,
    today: Schema.DateTimeUtc,
    open: Schema.Boolean
  }),
  message: Msg
}).make({
  init: () => {
    const today = DateTime.removeTime(DateTime.nowUnsafe())
    return { date: null, month: DateTime.startOf(today, "month"), today, open: false }
  },
  update: {
    Picked: ($, { date }) => $.evolve({ date }),
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    ChangedMonth: ($, { month }) => $.evolve({ month })
  },
  view: (h, model) =>
    DatePicker(h, {
      label: "Departure",
      value: model.date,
      month: model.month,
      today: model.today,
      open: model.open,
      locale: "en-GB",
      onOpenChange: ({ open }) => Msg.ChangedOpen({ open }),
      onPick: ({ date }) => Msg.Picked({ date }),
      onMonthChange: ({ month }) => Msg.ChangedMonth({ month })
    })
})
