import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { Separator as KitSeparator } from "@effect/ui-kit/Separator"
import type { Html } from "@effect/ui/html"
import { Match } from "effect"
import { SeparatorStyle } from "./separator.component.style.ts"

export type SeparatorProps = Style.Props<typeof SeparatorStyle>

export const Separator = <Msg>(h: Html.H<Msg>, options: SeparatorProps & { readonly decorative?: boolean } = {}) =>
  KitSeparator(h, {
    element: h.div.attr(
      "role",
      Match.value(options.decorative).pipe(
        Match.when(true, () => "none"),
        Match.orElse(() => undefined)
      )
    ),
    props: { orientation: options.orientation ?? "horizontal" }
  }).class(getStyleClasses({ style: SeparatorStyle, props: options }).root)
