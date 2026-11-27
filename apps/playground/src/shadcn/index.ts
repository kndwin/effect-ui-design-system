import { DesignSystem } from "@acme/ds"
import { ButtonStyle } from "./button.css.ts"
import { Tokens } from "./tokens.ts"

export { ButtonSize, ButtonVariant } from "./scales.ts"
export const DS = DesignSystem.make({ tokens: Tokens, styles: [ButtonStyle] })
export const Button = DS.component(ButtonStyle)
