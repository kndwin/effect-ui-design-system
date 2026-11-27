import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { GridSpanStyle, GridStyle } from "./grid.component.style.ts"

export type GridProps = Style.Props<typeof GridStyle> & { readonly class?: string | undefined }
export type GridSpanProps = Style.Props<typeof GridSpanStyle> & { readonly class?: string | undefined }

export const Grid = <E extends Classable>(element: E, options: GridProps = {}): Classed<E> =>
  render(element, Style.classes(GridStyle, options), options.class)

export const GridSpan = <E extends Classable>(element: E, options: GridSpanProps = {}): Classed<E> =>
  render(element, Style.classes(GridSpanStyle, options), options.class)
