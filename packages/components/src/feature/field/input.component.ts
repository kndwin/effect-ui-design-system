import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Input as KitInput, type InputElement } from "@effect/ui-kit/Input"
import { Html } from "@effect/ui/html"
import { InputStyle } from "./input.component.style.ts"

export type InputProps = Style.Props<typeof InputStyle>

export const Input = <Msg, R = never>(
  h: { readonly input: InputElement<Msg> },
  options: InputProps & {
    readonly value: string
    readonly onUpdate?: ((event: { readonly value: string }) => NoInfer<Msg> | undefined) | undefined
    readonly disabled?: boolean | undefined
    readonly placeholder?: string | undefined
    readonly label?: string | undefined
    readonly element?: InputElement<Msg, R> | undefined
    readonly class?: string | undefined
  }
): InputElement<Msg, R> =>
  KitInput<Msg, R>(h, {
    element: options.element,
    props: { value: options.value, disabled: options.disabled },
    onUpdate: options.onUpdate
  })
    .class(Html.classNames(getStyleClasses({ style: InputStyle, props: options }).root, options.class))
    .attr("placeholder", options.placeholder)
    .attr("aria-label", options.label)
