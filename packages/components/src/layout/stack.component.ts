import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { StackItemStyle, StackStyle } from "./stack.component.style.ts"

export type StackProps = Style.Props<typeof StackStyle> & { readonly class?: string | undefined }
export type StackItemProps = Style.Props<typeof StackItemStyle> & { readonly class?: string | undefined }

/** `Stack(h.div, { direction, gap, align, justify, wrap }).children(…)` */
export const Stack = <E extends Classable>(element: E, options: StackProps = {}): Classed<E> =>
  render(element, Style.classes(StackStyle, options), options.class)

/** A row, vertically centred unless `align` says otherwise. */
export const HStack = <E extends Classable>(element: E, options: Omit<StackProps, "direction"> = {}): Classed<E> =>
  Stack(element, { align: "center", ...options, direction: "row" })

/** A column. */
export const VStack = <E extends Classable>(element: E, options: Omit<StackProps, "direction"> = {}): Classed<E> =>
  Stack(element, { ...options, direction: "column" })

/** A child of a stack that grows (`grow`) or keeps its size (`fixed`). */
export const StackItem = <E extends Classable>(element: E, options: StackItemProps = {}): Classed<E> =>
  render(element, Style.classes(StackItemStyle, options), options.class)
