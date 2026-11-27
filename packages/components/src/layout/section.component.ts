import { type Classable, type Classed, render } from "@acme/design-system/Element"
import * as Style from "@acme/design-system/Style"
import { SectionStyle } from "./section.component.style.ts"

export type SectionProps = Style.Props<typeof SectionStyle> & { readonly class?: string | undefined }

export const Section = <E extends Classable>(element: E, options: SectionProps = {}): Classed<E> =>
  render(element, Style.classes(SectionStyle, options), options.class)
