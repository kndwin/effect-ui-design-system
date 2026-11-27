import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Button as KitButton, type ButtonElement } from "@effect/ui-kit/Button"
import { Html } from "@effect/ui/html"
import type * as View from "@effect/ui/View"
import { ButtonStyle } from "./button.component.style.ts"
import { Match } from "effect"

export type ButtonProps = Style.Props<typeof ButtonStyle>

export interface ButtonOptions<Msg, R> {
  readonly onPress?: NoInfer<Msg> | undefined
  readonly disabled?: boolean | undefined

  readonly loading?: boolean | undefined
  readonly type?: "button" | "submit" | "reset" | undefined
  readonly element?: ButtonElement<Msg, R> | undefined

  readonly pressed?: boolean | undefined
  readonly label?: string | undefined
  readonly class?: string | undefined
  readonly children?: string | ReadonlyArray<ButtonChild<Msg, R>> | undefined
}

export type ButtonChild<Msg, _R = never> = View.Input<Msg, unknown>

export const Button = <Msg, R = never>(
  h: { readonly button: ButtonElement<Msg> },
  options: ButtonOptions<Msg, R> & ButtonProps
): ButtonElement<Msg, R> => {
  const classes = getStyleClasses({ style: ButtonStyle, props: options })
  const loading = options.loading === true
  const el = KitButton<Msg, R>(h, {
    element: options.element,
    onPress: options.onPress,
    props: {
      disabled: loading || options.disabled === true,
      focusableWhenDisabled: loading,
      type: options.type
    }
  })
    .class(Html.classNames(classes.root, options.class))
    .attr(
      "aria-busy",
      Match.value(loading).pipe(
        Match.when(true, () => "true"),
        Match.orElse(() => undefined)
      )
    )
    .attr(
      "aria-pressed",
      Match.value(options.pressed).pipe(
        Match.when(undefined, () => undefined),
        Match.orElse((pressed) => String(pressed))
      )
    )
    .attr("aria-label", options.label)
  const { children } = options
  return Match.value(children).pipe(
    Match.when(undefined, () => el),
    Match.when(Match.string, (text) => el.children(text)),
    Match.orElse((nodes) => el.children(...nodes))
  ) as ButtonElement<Msg, R>
}
