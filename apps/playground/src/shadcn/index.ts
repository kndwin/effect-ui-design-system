import * as DesignSystem from "@cave/ds/DesignSystem"
import { ButtonStyle } from "./button.css.ts"
import { dark, light } from "./themes.css.ts"
import { Colors, Motion, Radius, Shadow, Spacing, Stroke, Text } from "./tokens.ts"

export { ButtonSize, ButtonVariant } from "./scales.ts"
export const DS = DesignSystem.make({
  tokens: { Colors, Spacing, Radius, Stroke, Text, Shadow, Motion },
  themes: [light, dark],
  styles: [ButtonStyle]
})
export const Button = DS.component(ButtonStyle)
