import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Calendar as KitCalendar } from "@effect/ui-kit/Calendar"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { DateTime, Match } from "effect"
import { CalendarStyle } from "./calendar.component.style.ts"

export const Calendar = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly value: DateTime.DateTime | null
    readonly month: DateTime.DateTime
    readonly today: DateTime.DateTime
    readonly onPick: (event: { readonly date: DateTime.Utc }) => NoInfer<Msg> | undefined
    readonly onMonthChange: (event: { readonly month: DateTime.Utc }) => NoInfer<Msg> | undefined
    readonly min?: DateTime.DateTime | undefined
    readonly max?: DateTime.DateTime | undefined
    readonly locale?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: CalendarStyle, props: {} })
  return KitCalendar(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      value: options.value,
      month: options.month,
      today: options.today,
      min: options.min,
      max: options.max,
      locale: options.locale,
      disabled: options.disabled
    },
    onEmit: { Picked: options.onPick, RequestedMonth: options.onMonthChange },
    view: (calendar) =>
      calendar
        .root(h.div.class(classes.root))
        .children(
          h.div
            .class(classes.header)
            .children(
              calendar.previous(h.button.class(classes.nav).attr("aria-label", "Previous month")).children("‹"),
              calendar.heading(h.h2.class(classes.heading)).children(calendar.title),
              calendar.next(h.button.class(classes.nav).attr("aria-label", "Next month")).children("›")
            ),
          calendar
            .grid(h.table.class(classes.grid))
            .children(
              h.thead.children(
                h.tr.children(
                  ...calendar.weekdays.map((day, index) =>
                    calendar.weekday({ element: h.th.class(classes.weekday), index }).children(day.short)
                  )
                )
              ),
              h.tbody.children(
                ...calendar.weeks.map((week) =>
                  h.tr.children(
                    ...week.map((date) =>
                      calendar
                        .cell({ element: h.td.class(classes.cell), date })
                        .children(
                          calendar
                            .day({ element: h.button.class(classes.day), date })
                            .children(String(DateTime.getPartUtc(date, "day")))
                        )
                    )
                  )
                )
              )
            )
        )
  }) as Child<Msg>
}
