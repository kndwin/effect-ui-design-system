// Must-not-compile cases. Each @ts-expect-error fails tsc if the line DOES compile.
import { Style, Theme, TokenColor, Variant } from "@acme/ds"
import { Avatar as AvatarKit } from "@acme/ds/kit/avatar"
import { Button as ButtonKit } from "@acme/ds/kit/button"
import { UiSchema } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import type { ButtonStyle } from "../src/button.css.ts"
import { Avatar, Button, Colors, Spacing, Tokens, Tone } from "../src/index.ts"

const M = UiSchema.TaggedEnum({ A: {} })
declare const h: Html.H<typeof M.Type>

// ✅ positives
Button(h, { tone: "primary", size: "sm", onPress: M.A(), children: "ok" })
Avatar(h, { name: "Ada Lovelace", size: "lg", shape: "square" })
export type P = Style.Props<typeof ButtonStyle>

// ❌ variant value not in Tone / Size
// @ts-expect-error
Button(h, { tone: "warning", children: "x" })
// @ts-expect-error
Button(h, { size: "lg", children: "x" })
// ❌ Avatar requires a name
// @ts-expect-error
Avatar(h, { size: "sm" })
// ❌ parts and states come from the kit
// @ts-expect-error
Style.make(ButtonKit)({ base: { icon: {} } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { states: { highlighted: {} } } } })
// @ts-expect-error
Style.make(AvatarKit)({ base: { image: { states: { loaded: {} } } } }) // data-status lives on root
// ❌ missing "danger"
Style.make(ButtonKit)({
  // @ts-expect-error
  variants: { tone: Variant.make(Tone, { primary: {}, neutral: {} }) }
})
// ❌ no such token
// @ts-expect-error
Colors.primary
// ❌ raw values / wrong token kind
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { background: "#ff0000" } } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { color: Spacing[2] } } })
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { paddingInline: "12px" } } })
// ❌ a kind module only makes its own kind
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { height: TokenColor.make("x", ["a"]).a } } })
// ❌ a theme must fill in the whole contract
// @ts-expect-error
Theme.make(Tokens, { name: "partial", values: { Colors: {} } })
