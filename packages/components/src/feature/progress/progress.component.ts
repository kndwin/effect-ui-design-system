import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Progress as KitProgress } from "@effect/ui-kit/Progress"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { ProgressStyle } from "./progress.component.style.ts"

export const Progress = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: number | null
    readonly max?: number | undefined
    readonly valueText?: string | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ProgressStyle, props: {} })
  return KitProgress(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { value: options.value, max: options.max, valueText: options.valueText },
    view: (progress) =>
      progress
        .root(h.div.class(classes.root))
        .children(
          h.div
            .class(classes.header)
            .children(
              progress.label(h.span.class(classes.label)).children(options.label),
              progress.value(h.span.class(classes.value))
            ),
          progress.track(h.div.class(classes.track)).children(progress.indicator(h.div.class(classes.indicator)))
        )
  }) as Child<Msg>
}
