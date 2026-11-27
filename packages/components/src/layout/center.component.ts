import { type Classable, type Classed, render } from "@acme/design-system/Element"
import * as Style from "@acme/design-system/Style"
import { CenterStyle } from "./center.component.style.ts"

export type CenterProps = Style.Props<typeof CenterStyle> & { readonly class?: string | undefined }

export const Center = <E extends Classable>(element: E, options: CenterProps = {}): Classed<E> =>
  render(element, Style.classes(CenterStyle, options), options.class)
