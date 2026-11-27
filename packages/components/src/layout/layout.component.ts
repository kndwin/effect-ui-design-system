import { type Classable, type Classed, render } from "@acme/design-system/Element"
import * as Style from "@acme/design-system/Style"
import {
  LayoutContentStyle,
  LayoutFooterStyle,
  LayoutHeaderStyle,
  LayoutPanelStyle,
  LayoutStyle
} from "./layout.component.style.ts"

type Extra = { readonly class?: string | undefined }

export const Layout = <E extends Classable>(element: E, options: Extra = {}): Classed<E> =>
  render(element, Style.classes(LayoutStyle, {}), options.class)

export const LayoutHeader = <E extends Classable>(element: E, options: Extra = {}): Classed<E> =>
  render(element, Style.classes(LayoutHeaderStyle, {}), options.class)

export const LayoutPanel = <E extends Classable>(
  element: E,
  options: Style.Props<typeof LayoutPanelStyle> & Extra = {}
): Classed<E> => render(element, Style.classes(LayoutPanelStyle, options), options.class)

export const LayoutContent = <E extends Classable>(element: E, options: Extra = {}): Classed<E> =>
  render(element, Style.classes(LayoutContentStyle, {}), options.class)

export const LayoutFooter = <E extends Classable>(element: E, options: Extra = {}): Classed<E> =>
  render(element, Style.classes(LayoutFooterStyle, {}), options.class)
