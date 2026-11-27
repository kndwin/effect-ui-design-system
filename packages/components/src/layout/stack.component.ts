import { type Classable, type Classed, styled, type StyledOptions } from "@acme/design-system/Element"
import { StackItemStyle, StackStyle } from "./stack.component.style.ts"

type Options = Omit<StyledOptions<typeof StackStyle>, "direction">

export const Stack = styled(StackStyle)
export const StackItem = styled(StackItemStyle)

export const HStack = <E extends Classable>(element: E, options: Options = {}): Classed<E> =>
  Stack(element, { align: "center", ...options, direction: "row" })

export const VStack = <E extends Classable>(element: E, options: Options = {}): Classed<E> =>
  Stack(element, { ...options, direction: "column" })
