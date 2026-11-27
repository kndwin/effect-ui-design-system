import * as Style from "@acme/design-system/Style"
import * as Theme from "@acme/design-system/Theme"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as Variant from "@acme/design-system/Variant"
import { AvatarParts as AvatarKit } from "../src/feature/avatar/avatar.parts.constant.ts"
import { ButtonParts as ButtonKit } from "../src/platform/button/button.parts.constant.ts"
import { UiSchema } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import { Avatar } from "../src/feature/avatar/avatar.component.ts"
import { Button } from "../src/platform/button/button.component.ts"
import type { ButtonStyle } from "../src/platform/button/button.component.style.ts"
import { Colors, Spacing, Tokens } from "../src/platform/token/contract.token.ts"
import { ToneSchema } from "../src/platform/scale/scales.schema.ts"

const M = UiSchema.TaggedEnum({ A: {} })
declare const h: Html.H<typeof M.Type>

Button(h, { tone: "primary", size: "sm", onPress: M.A(), children: "ok" })
Avatar(h, { name: "Ada Lovelace", size: "lg", shape: "square" })
export type P = Style.Props<typeof ButtonStyle>

// @ts-expect-error
Button(h, { tone: "warning", children: "x" })
// @ts-expect-error
Button(h, { size: "lg", children: "x" })

// @ts-expect-error
Avatar(h, { size: "sm" })

// @ts-expect-error
Style.make(ButtonKit)({ base: { icon: {} } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { states: { highlighted: {} } } } })
// @ts-expect-error
Style.make(AvatarKit)({ base: { image: { states: { loaded: {} } } } })

Style.make(ButtonKit)({
  // @ts-expect-error
  variants: { tone: Variant.make(ToneSchema, { primary: {}, neutral: {} }) }
})

// @ts-expect-error
void Colors.primary

// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { background: "#ff0000" } } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { color: Spacing[2] } } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { paddingInline: "12px" } } })

// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { height: TokenColor.make("x", ["a"]).a } } })

// @ts-expect-error
Theme.make(Tokens, { name: "partial", values: { Colors: {} } })
