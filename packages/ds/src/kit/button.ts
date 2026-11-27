// The ONE place that knows ui-kit Button's DOM contract. When ui-kit changes,
// this file and its kit-map test change; nothing else does.
import { Button as KitButton, type ButtonElement } from "@effect/ui-kit/Button"
import { Html } from "@effect/ui/html"
import * as Kit from "../Kit.ts"

const ButtonDescriptor = Kit.describe({
  name: "Button",
  parts: {
    root: { states: { disabled: "[data-disabled]", busy: "[aria-busy=true]" } }
  },
  vars: {},
  pseudo: ["hover", "focusVisible", "active"]
})
// Named interface so error messages say `ButtonKit`, not the whole descriptor.
export interface ButtonKit extends Kit.Type<typeof ButtonDescriptor> {}
export const Button: ButtonKit = ButtonDescriptor

/** Design-system-level options; flattened from ui-kit's `{ props: {...} }`. */
export interface ButtonOptions<Msg, R> {
  readonly onPress?: NoInfer<Msg> | undefined
  readonly disabled?: boolean | undefined
  /** disabled + focusable + aria-busy: focus stays put while it works */
  readonly loading?: boolean | undefined
  readonly type?: "button" | "submit" | "reset" | undefined
  readonly element?: ButtonElement<Msg, R> | undefined
  readonly class?: string | undefined
  readonly children?: string | undefined
}

export const renderButton = <Msg, R = never>(
  h: { readonly button: ButtonElement<Msg> },
  options: ButtonOptions<Msg, R>,
  classes: { readonly root: string }
): ButtonElement<Msg, R> => {
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
    .attr("aria-busy", loading ? "true" : undefined)
  return options.children === undefined ? el : el.children(options.children)
}
