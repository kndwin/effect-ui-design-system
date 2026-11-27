import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { GridSpanStyle, GridStyle } from "./grid.component.style.ts"

export type GridProps = Style.Props<typeof GridStyle> & { readonly class?: string | undefined }
export type GridSpanProps = Style.Props<typeof GridSpanStyle> & { readonly class?: string | undefined }

/** `Grid(h.div, { columns: "3", gap: "4", stack: true }).children(…)` */
export const Grid = <E extends Classable>(element: E, options: GridProps = {}): Classed<E> =>
  render(element, Style.classes(GridStyle, options), options.class)

/** A grid child spanning `span` columns. */
export const GridSpan = <E extends Classable>(element: E, options: GridSpanProps = {}): Classed<E> =>
  render(element, Style.classes(GridSpanStyle, options), options.class)
