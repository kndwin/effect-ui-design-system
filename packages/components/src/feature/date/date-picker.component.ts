import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { DatePicker as KitDatePicker } from "@effect/ui-kit/DatePicker"
import { Field as KitField } from "@effect/ui-kit/Field"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { DateTime, Match } from "effect"
import { CalendarStyle } from "./calendar.component.style.ts"
import { DateFieldStyle } from "./date-field.component.style.ts"

export const DatePicker = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: DateTime.DateTime | null
    readonly month: DateTime.DateTime
    readonly today: DateTime.DateTime
    readonly open: boolean
    readonly onOpenChange: (event: { readonly open: boolean }) => NoInfer<Msg> | undefined
    readonly onPick: (event: { readonly date: DateTime.Utc | null }) => NoInfer<Msg> | undefined
    readonly onMonthChange: (event: { readonly month: DateTime.Utc }) => NoInfer<Msg> | undefined
    readonly locale?: string | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: DateFieldStyle, props: {} })
  const calendar = getStyleClasses({ style: CalendarStyle, props: {} })
  return KitField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { disabled: options.disabled },
    view: (field) =>
      KitDatePicker(h, {
        props: {
          value: options.value,
          open: options.open,
          month: options.month,
          today: options.today,
          locale: options.locale,
          name: options.name,
          disabled: field.disabled,
          align: "start",
          sideOffset: 4
        },
        onEmit: {
          Picked: ({ date }) => options.onPick({ date }),
          RequestedOpen: () => options.onOpenChange({ open: true }),
          RequestedClose: () => options.onOpenChange({ open: false }),
          RequestedMonth: ({ month }) => options.onMonthChange({ month })
        },
        view: (picker) =>
          field.root(field.focusWithin(h.div.class(classes.root))).children(
            h.span.class(classes.label).attr("aria-hidden", "true").children(options.label),
            h.div.class(classes.group).children(
              picker
                .input(field.member(h.input.class(classes.input)))
                .attr("aria-label", options.label)
                .attr("placeholder", picker.pattern),
              picker.trigger(h.button.class(classes.trigger).attr("aria-label", "Choose date")).children("▦")
            ),
            picker
              .positioner(h.div.class(classes.positioner))
              .children(
                picker
                  .popup(h.div.class(classes.popup).attr("aria-label", options.label))
                  .children(
                    picker
                      .root(h.div.class(calendar.root))
                      .children(
                        h.div
                          .class(calendar.header)
                          .children(
                            picker
                              .previous(h.button.class(calendar.nav).attr("aria-label", "Previous month"))
                              .children("‹"),
                            picker.heading(h.h2.class(calendar.heading)).children(picker.title),
                            picker.next(h.button.class(calendar.nav).attr("aria-label", "Next month")).children("›")
                          ),
                        picker
                          .grid(h.table.class(calendar.grid))
                          .children(
                            h.thead.children(
                              h.tr.children(
                                ...picker.weekdays.map((day, index) =>
                                  picker.weekday({ element: h.th.class(calendar.weekday), index }).children(day.short)
                                )
                              )
                            ),
                            h.tbody.children(
                              ...picker.weeks.map((week) =>
                                h.tr.children(
                                  ...week.map((date) =>
                                    picker
                                      .cell({ element: h.td.class(calendar.cell), date })
                                      .children(
                                        picker
                                          .day({ element: h.button.class(calendar.day), date })
                                          .children(String(DateTime.getPartUtc(date, "day")))
                                      )
                                  )
                                )
                              )
                            )
                          )
                      )
                  )
              )
          )
      })
  }) as Child<Msg>
}
