import { Select as KitSelect } from "@effect/ui-kit/Select"
import { Match } from "effect"
import { SelectDef } from "./select.define.ts"
import { SelectMessageSchema } from "./select.schema.ts"

export const view = SelectDef.view((h, { open }) => {
  const { classes, items } = h.props
  return KitSelect(h, {
    props: {
      open,
      items,
      value: h.props.value,
      placeholder: h.props.placeholder,
      disabled: h.props.disabled,
      name: h.props.name,
      alignItemWithTrigger: false
    },
    onEmit: {
      RequestedOpen: () => SelectMessageSchema.RequestedOpen(),
      RequestedClose: () => SelectMessageSchema.RequestedClose(),
      Picked: ({ value }) =>
        SelectMessageSchema.PickedValue({
          value: Match.value(value).pipe(
            Match.when(Match.string, (picked) => picked),
            Match.orElse(() => null)
          )
        }),
      Settled: () => undefined
    },
    view: (select) =>
      h.div
        .class(classes.root, h.props.extraClass)
        .children(
          select
            .trigger(h.button.class(classes.trigger).attr("aria-label", h.props.label))
            .children(select.value(h.span.class(classes.value)), select.icon(h.span.class(classes.icon)).children("▾")),
          select
            .positioner(h.div.class(classes.positioner))
            .children(
              select
                .popup(h.div.class(classes.popup))
                .children(
                  ...items.map(({ value, label }) =>
                    select
                      .item({ element: h.div.class(classes.item), value })
                      .children(
                        select.itemText(h.div).children(label),
                        select.itemIndicator({ element: h.span.class(classes.indicator), value })?.children("✓")
                      )
                  )
                )
            )
        )
  })
})
