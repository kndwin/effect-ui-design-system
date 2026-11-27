import * as Element from "@weft/design-system/Element"
import { StackItemStyle, StackStyle } from "./stack.component.style.ts"

type Options = Omit<Element.StyledOptions<typeof StackStyle>, "direction">

export const Stack = Element.make(StackStyle)
export const StackItem = Element.make(StackItemStyle)

export const HStack = <E extends Element.Classable>(element: E, options: Options = {}): Element.Classed<E> =>
  Stack(element, { align: "center", ...options, direction: "row" })

export const VStack = <E extends Element.Classable>(element: E, options: Options = {}): Element.Classed<E> =>
  Stack(element, { ...options, direction: "column" })
