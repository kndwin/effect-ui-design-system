import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Accordion as KitAccordion, AccordionItem } from "@effect/ui-kit/Accordion"
import type { Html } from "@effect/ui/html"
import type { Child, Input } from "@effect/ui/View"
import { Match } from "effect"
import { AccordionStyle } from "./accordion.component.style.ts"

export const Accordion = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly value: ReadonlyArray<string>
    readonly onValueChange: (event: { readonly value: ReadonlyArray<string> }) => NoInfer<Msg> | undefined
    readonly items: ReadonlyArray<{
      readonly value: string
      readonly title: string
      readonly disabled?: boolean
      readonly content: ReadonlyArray<Input<Msg, unknown>>
    }>
    readonly multiple?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: AccordionStyle, props: {} })
  return KitAccordion(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { value: [...options.value], multiple: options.multiple },
    onEmit: { Toggled: ({ value }) => options.onValueChange({ value }) },
    view: (accordion) =>
      accordion.root(h.div.class(classes.root)).children(
        ...options.items.map((entry, index) =>
          AccordionItem(h, {
            key: entry.value,
            props: { value: entry.value, index, disabled: entry.disabled },
            view: (item) =>
              item.root(h.div.class(classes.item)).children(
                item.header(h.h3.class(classes.header)).children(
                  item.trigger(h.button.class(classes.trigger)).children(
                    entry.title,
                    h.span
                      .class(classes.icon)
                      .attr("aria-hidden", "true")
                      .children(
                        Match.value(item.open).pipe(
                          Match.when(true, () => "−"),
                          Match.orElse(() => "+")
                        )
                      )
                  )
                ),
                item
                  .panel(h.div.class(classes.panel))
                  ?.children(h.div.class(classes.content).children(...entry.content))
              )
          })
        )
      )
  }) as Child<Msg>
}
