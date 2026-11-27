import { type ButtonOptions, renderButton } from "@acme/ds/kit/button"
import * as Style from "@acme/ds/Style"
import type { ButtonElement } from "@effect/ui-kit/Button"
import { ButtonStyle } from "./button.component.style.ts"

export type ButtonProps = Style.Props<typeof ButtonStyle>

/** `Button(h, { tone, size, onPress, loading, disabled, children })` */
export const Button = <Msg, R = never>(
  h: { readonly button: ButtonElement<Msg> },
  options: ButtonOptions<Msg, R> & ButtonProps
): ButtonElement<Msg, R> => renderButton(h, options, Style.classes(ButtonStyle, options))
