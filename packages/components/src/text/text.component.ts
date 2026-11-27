import { type Classable, type Classed, render } from "@acme/ds/kit/element"
import * as Style from "@acme/ds/Style"
import { TextStyle } from "./text.component.style.ts"

export type TextProps = Style.Props<typeof TextStyle> & { readonly class?: string | undefined }

export const Text = <E extends Classable>(element: E, options: TextProps = {}): Classed<E> =>
  render(element, Style.classes(TextStyle, options), options.class)
