import * as Element from "@weft/design-system/Element"
import { SwatchStyle } from "./swatch.component.style.ts"

interface Attrs {
  attr(name: string, value: string | undefined): Attrs
}

const Root = Element.make(SwatchStyle)

export const Swatch = <E extends Element.Classable>(
  element: E,
  options: Element.StyledOptions<typeof SwatchStyle> & { readonly color: string }
): Element.Classed<E> =>
  (Root(element, options) as unknown as Attrs)
    .attr("style", `background:${options.color}`)
    .attr("aria-hidden", "true") as Element.Classed<E>
