import { type Classable, type Classed, styled, type StyledOptions } from "@acme/design-system/Element"
import { SwatchStyle } from "./swatch.component.style.ts"

interface Attrs {
  attr(name: string, value: string | undefined): Attrs
}

const Root = styled(SwatchStyle)

export const Swatch = <E extends Classable>(
  element: E,
  options: StyledOptions<typeof SwatchStyle> & { readonly color: string }
): Classed<E> =>
  (Root(element, options) as unknown as Attrs)
    .attr("style", `background:${options.color}`)
    .attr("aria-hidden", "true") as Classed<E>
