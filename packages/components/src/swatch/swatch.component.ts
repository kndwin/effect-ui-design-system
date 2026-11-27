import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { SwatchStyle } from "./swatch.component.style.ts"

export type SwatchProps = Style.Props<typeof SwatchStyle> & { readonly class?: string | undefined }

/** A colour chip. The colour is data (any CSS colour), not a style. */
export const Swatch = <E extends Classable>(
  element: E,
  options: SwatchProps & { readonly color: string }
): Classed<E> => {
  const el = render(element, Style.classes(SwatchStyle, options), options.class) as unknown as Attrs
  return el.attr("style", `background:${options.color}`).attr("aria-hidden", "true") as Classed<E>
}

interface Attrs {
  attr(name: string, value: string | undefined): Attrs
}
