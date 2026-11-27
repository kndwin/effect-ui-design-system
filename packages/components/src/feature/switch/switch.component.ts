import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Switch as KitSwitch } from "@effect/ui-kit/Switch"
import type { Html } from "@effect/ui/html"
import { SwitchStyle } from "./switch.component.style.ts"

export const Switch = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly checked: boolean
    readonly onToggle: (event: { readonly checked: boolean }) => NoInfer<Msg> | undefined
    readonly label?: string | undefined
    readonly disabled?: boolean | undefined
    readonly name?: string | undefined
    readonly class?: string | undefined
  }
) => {
  const classes = getStyleClasses({ style: SwitchStyle, props: {} })
  return KitSwitch(h, {
    props: { checked: options.checked, disabled: options.disabled, name: options.name },
    onToggle: options.onToggle,
    view: (parts) =>
      h.label
        .class(classes.root, options.class)
        .children(
          parts.root(h.button.class(classes.track)).children(parts.thumb(h.span.class(classes.thumb))),
          options.label ?? ""
        )
  })
}
