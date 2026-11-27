import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { CenterStyle } from "./center.component.style.ts"

export type CenterProps = Style.Props<typeof CenterStyle> & { readonly class?: string | undefined }

/** Centres its children on both axes. */
export const Center = <E extends Classable>(element: E, options: CenterProps = {}): Classed<E> =>
  render(element, Style.classes(CenterStyle, options), options.class)
