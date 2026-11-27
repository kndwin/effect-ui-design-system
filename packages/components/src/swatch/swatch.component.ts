import { type Classable, type Classed, render } from "@acme/design-system/Element"
import * as Style from "@acme/design-system/Style"
import { SwatchStyle } from "./swatch.component.style.ts"

export type SwatchProps = Style.Props<typeof SwatchStyle> & { readonly class?: string | undefined }

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
