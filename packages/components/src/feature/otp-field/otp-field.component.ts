import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { OTPField as KitOTPField } from "@effect/ui-kit/OTPField"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Match, type Redacted } from "effect"
import { OtpFieldStyle } from "./otp-field.component.style.ts"

export const OtpField = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly value: Redacted.Redacted<string>
    readonly onUpdate: (event: { readonly value: Redacted.Redacted<string> }) => NoInfer<Msg> | undefined
    readonly onComplete?:
      | ((event: { readonly value: Redacted.Redacted<string> }) => NoInfer<Msg> | undefined)
      | undefined
    readonly length?: number | undefined
    readonly name?: string | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: OtpFieldStyle, props: {} })
  return KitOTPField(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { value: options.value, length: options.length ?? 6, name: options.name, disabled: options.disabled },
    onEmit: {
      Updated: ({ value }) => options.onUpdate({ value }),
      Completed: ({ value }) => options.onComplete?.({ value }),
      Rejected: () => undefined
    },
    view: (otp) =>
      otp
        .root(h.div.class(classes.root).attr("aria-label", options.label))
        .children(...Array.makeBy(otp.length, (index) => otp.input({ element: h.input.class(classes.slot), index })))
  }) as Child<Msg>
}
