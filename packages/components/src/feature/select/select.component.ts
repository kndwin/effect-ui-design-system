import type * as Style from "@weft/design-system/Style"
import { getStyleClasses } from "@weft/design-system/StyleClasses"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { SelectStyle } from "./select.component.style.ts"
import { SelectDef } from "./select.define.ts"
import type { SelectItem } from "./select.schema.ts"
import { update } from "./select.update.ts"
import { view } from "./select.view.ts"

export type SelectProps = Style.Props<typeof SelectStyle>

const SelectImpl = SelectDef.make({ init: () => ({ open: false }), update, view })

export const Select = <Msg>(
  h: Html.H<Msg>,
  options: SelectProps & {
    readonly label: string
    readonly value: string | null
    readonly items: ReadonlyArray<SelectItem>
    readonly onPick: (event: { readonly value: string | null }) => NoInfer<Msg> | undefined
    readonly placeholder?: string | undefined
    readonly disabled?: boolean | undefined
    readonly name?: string | undefined
    readonly key?: string | undefined
    readonly class?: string | undefined
  }
): Child<Msg> =>
  SelectImpl(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      label: options.label,
      value: options.value,
      items: options.items,
      placeholder: options.placeholder,
      disabled: options.disabled,
      name: options.name,
      extraClass: options.class,
      classes: getStyleClasses({ style: SelectStyle, props: options })
    },
    onEmit: { Picked: ({ value }) => options.onPick({ value }) }
  }) as Child<Msg>
