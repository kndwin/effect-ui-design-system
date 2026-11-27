import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { ToggleGroup as KitToggleGroup } from "@effect/ui-kit/ToggleGroup"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { ToggleStyle } from "./toggle.component.style.ts"
import { ToggleGroupStyle } from "./toggle-group.component.style.ts"

export type ToggleGroupProps = Style.Props<typeof ToggleStyle>

export const ToggleGroup = <Msg>(
  h: Html.H<Msg>,
  options: ToggleGroupProps & {
    readonly label: string
    readonly items: ReadonlyArray<{
      readonly value: string
      readonly label: string
      readonly disabled?: boolean | undefined
    }>
    readonly value: ReadonlyArray<string>
    readonly onToggle: (event: { readonly value: ReadonlyArray<string> }) => NoInfer<Msg> | undefined
    readonly multiple?: boolean | undefined
    readonly orientation?: "horizontal" | "vertical" | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ToggleGroupStyle, props: {} })
  const item = getStyleClasses({ style: ToggleStyle, props: options })
  return KitToggleGroup(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: {
      value: options.value,
      items: options.items,
      multiple: options.multiple,
      orientation: options.orientation,
      disabled: options.disabled
    },
    onEmit: options.onToggle,
    view: (group) =>
      group
        .root(h.div.class(classes.root).attr("aria-label", options.label))
        .children(
          ...options.items.map((entry) =>
            group.item({ element: h.button.class(item.root), value: entry.value }).children(entry.label)
          )
        )
  }) as Child<Msg>
}
