// The component library: the DS (contract + styles) and the components it makes.
// @acme/components: Button, Avatar and CodeBlock, styled against the token contract in tokens.ts.
// No colours, sizes or fonts live here: import a theme (@acme/theme-shadcn, @acme/theme-astryx)
// and set data-theme / data-mode on a root element.
import { DesignSystem } from "@acme/ds"
import { pickByName } from "@acme/ds/kit/avatar"
import { AvatarStyle } from "./avatar.css.ts"
import { ButtonStyle } from "./button.css.ts"
import { CodeBlockStyle } from "./code-block.css.ts"
import { Hue } from "./scales.pure.ts"
import { Tokens } from "./tokens.pure.ts"

export const DS = DesignSystem.make({ tokens: Tokens, styles: [ButtonStyle, AvatarStyle, CodeBlockStyle] })

export const Button = DS.component(ButtonStyle)
/** The fallback's hue comes from the name unless given. */
export const Avatar = DS.component(AvatarStyle, (o: { name: string }) => ({ hue: pickByName(o.name, Hue.literals) }))
export const CodeBlock = DS.component(CodeBlockStyle)
