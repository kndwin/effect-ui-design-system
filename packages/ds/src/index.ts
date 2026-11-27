import { ButtonStyle } from "./button.css.ts"
import * as DesignSystem from "./DesignSystem.ts"
import { dark, light } from "./themes.css.ts"
import { Colors, Radius, Spacing } from "./tokens.ts"

export { Size, Tone } from "./scales.ts"
export { Colors, Radius, Spacing }

export const DS = DesignSystem.make({ tokens: { Colors, Spacing, Radius }, themes: [dark, light], styles: [ButtonStyle] })
export const Button = DS.component(ButtonStyle)
