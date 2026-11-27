import type * as Style from "@weft/design-system/Style"
import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Toggle as KitToggle, type ToggleElement } from "@effect/ui-kit/Toggle"
import { Html } from "@effect/ui/html"
import type * as View from "@effect/ui/View"
import { Match } from "effect"
import { ToggleStyle } from "./toggle.component.style.ts"

export type ToggleProps = Style.Props<typeof ToggleStyle>

export const Toggle = <Msg, R = never>(
  h: { readonly button: ToggleElement<Msg> },
  options: ToggleProps & {
    readonly pressed: boolean
    readonly onToggle: (event: { readonly pressed: boolean }) => NoInfer<Msg> | undefined
    readonly label?: string | undefined
    readonly disabled?: boolean | undefined
    readonly class?: string | undefined
    readonly children?: ReadonlyArray<View.Input<Msg, unknown>> | string | undefined
  }
): ToggleElement<Msg, R> => {
  const el = KitToggle<Msg, R>(h, {
    props: { pressed: options.pressed, disabled: options.disabled },
    onToggle: options.onToggle
  })
    .class(Html.classNames(getStyleClasses({ style: ToggleStyle, props: options }).root, options.class))
    .attr("aria-label", options.label)
  const { children } = options
  return Match.value(children).pipe(
    Match.when(Match.string, (text) => el.children(text)),
    Match.orElse((nodes) => el.children(...(nodes ?? [])))
  ) as ToggleElement<Msg, R>
}
