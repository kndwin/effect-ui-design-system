import { Button } from "../../platform/button/button.component.ts"
import { getStyleClasses } from "@weft/design-system/StyleClasses"
import { Toolbar as KitToolbar } from "@effect/ui-kit/Toolbar"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Match } from "effect"

import { ToolbarStyle } from "./toolbar.component.style.ts"

export const Toolbar = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly items: ReadonlyArray<
      | {
          readonly value: string
          readonly label: string
          readonly onPress: NoInfer<Msg>
          readonly glyph?: string
          readonly pressed?: boolean
          readonly disabled?: boolean
        }
      | "separator"
    >
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: ToolbarStyle, props: {} })
  const buttons = Array.flatMap(options.items, (entry) =>
    Match.value(entry).pipe(
      Match.when("separator", () => []),
      Match.orElse((item) => [item])
    )
  )
  return KitToolbar(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { items: buttons.map(({ value, disabled }) => ({ value, disabled })) },
    view: (toolbar) =>
      toolbar.root(h.div.class(classes.root).attr("aria-label", options.label)).children(
        ...options.items.map((entry, index) =>
          Match.value(entry).pipe(
            Match.when("separator", () => toolbar.separator(h.div.class(classes.separator).key(`separator-${index}`))),
            Match.orElse((item) =>
              Button(h, {
                element: toolbar.button({ element: h.button, value: item.value }),
                tone: "ghost",
                size: "sm",
                pressed: item.pressed,
                onPress: item.onPress,
                label: Match.value(item.glyph).pipe(
                  Match.when(undefined, () => undefined),
                  Match.orElse(() => item.label)
                ),
                children: item.glyph ?? item.label
              })
            )
          )
        )
      )
  }) as Child<Msg>
}
