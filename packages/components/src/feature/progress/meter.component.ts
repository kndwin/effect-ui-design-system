import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Meter as KitMeter } from "@effect/ui-kit/Meter"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { ProgressStyle } from "./progress.component.style.ts"

export const Meter = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: number
    readonly max?: number | undefined
    readonly valueText?: string | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ProgressStyle, props: {} })
  return KitMeter(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { value: options.value, max: options.max, valueText: options.valueText },
    view: (meter) =>
      meter
        .root(h.div.class(classes.root))
        .children(
          h.div
            .class(classes.header)
            .children(
              meter.label(h.span.class(classes.label)).children(options.label),
              meter.value(h.span.class(classes.value))
            ),
          meter.track(h.div.class(classes.track)).children(meter.indicator(h.div.class(classes.indicator)))
        )
  }) as Child<Msg>
}
