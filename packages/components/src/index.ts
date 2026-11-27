// @acme/components: Button and Avatar, styled against the token contract in tokens.ts.
// No colours, sizes or fonts live here: import a theme (@acme/theme-shadcn, @acme/theme-astryx)
// and set data-theme / data-mode on a root element.
import { DesignSystem } from "@acme/ds"
import { pickByName } from "@acme/ds/kit/avatar"
import { AvatarStyle } from "./avatar.css.ts"
import { ButtonStyle } from "./button.css.ts"
import { Hue } from "./scales.ts"
import { Tokens } from "./tokens.ts"

export { AvatarSize, Hue, Shape, Size, Tone } from "./scales.ts"
export * from "./tokens.ts"

export const DS = DesignSystem.make({ tokens: Tokens, styles: [ButtonStyle, AvatarStyle] })

export const Button = DS.component(ButtonStyle)
/** The fallback's hue comes from the name unless given. */
export const Avatar = DS.component(AvatarStyle, (o: { name: string }) => ({ hue: pickByName(o.name, Hue.literals) }))
