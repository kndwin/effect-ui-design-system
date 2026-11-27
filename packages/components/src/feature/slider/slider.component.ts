import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Slider as KitSlider } from "@effect/ui-kit/Slider"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { SliderStyle } from "./slider.component.style.ts"

const getNumber = (value: number | ReadonlyArray<number>): number =>
  Match.value(value).pipe(
    Match.when(Match.number, (n) => n),
    Match.orElse((values) => values[0] ?? 0)
  )

export const Slider = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: number
    readonly onMove: (event: { readonly value: number }) => NoInfer<Msg> | undefined
    readonly onCommit?: ((event: { readonly value: number }) => NoInfer<Msg> | undefined) | undefined
    readonly min?: number | undefined
    readonly max?: number | undefined
    readonly step?: number | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
    readonly class?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: SliderStyle, props: {} })
  return KitSlider(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      value: options.value,
      min: options.min,
      max: options.max,
      step: options.step,
      disabled: options.disabled
    },
    onEmit: {
      Moved: ({ value }) => options.onMove({ value: getNumber(value) }),
      Committed: ({ value }) => options.onCommit?.({ value: getNumber(value) })
    },
    view: (slider) =>
      slider.root(h.div.class(classes.root, options.class)).children(
        slider.control(h.div.class(classes.control)).children(
          slider.track(h.div.class(classes.track)).children(
            slider.indicator(h.div.class(classes.indicator)),
            slider.thumb({
              element: h.div.class(classes.thumb),
              input: h.input.attr("aria-label", options.label)
            })
          )
        )
      )
  })
}
