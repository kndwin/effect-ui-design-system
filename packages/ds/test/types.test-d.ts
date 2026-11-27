// Must-not-compile cases. Each @ts-expect-error fails tsc if the line DOES compile.
import { UiSchema } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import * as Style from "../src/Style.ts"
import * as Theme from "../src/Theme.ts"
import * as Variant from "../src/Variant.ts"
import { Button } from "../src/index.ts"
import { Button as ButtonKit } from "../src/kit/button.ts"
import { Tone } from "../src/scales.ts"
import { Colors, Spacing } from "../src/tokens.ts"

declare const h: Html.H<typeof M.Type>
const M = UiSchema.TaggedEnum({ A: {} })

// ✅ positives
Button(h, { tone: "primary", size: "sm", onPress: M.A(), children: "ok" })
export type P = Style.Props<typeof import("../src/button.css.ts").ButtonStyle>

// ❌ variant value not in Tone
// @ts-expect-error
Button(h, { tone: "warning", children: "x" })
// ❌ not in Size
// @ts-expect-error
Button(h, { size: "lg", children: "x" })
// ❌ Button has no "icon" part
// @ts-expect-error
Style.make(ButtonKit)({ base: { icon: {} } })
// ❌ state the part doesn't have
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { states: { highlighted: {} } } } })
// ❌ missing "danger"
Style.make(ButtonKit)({
  // @ts-expect-error
  variants: { tone: Variant.make(Tone, { primary: {}, neutral: {} }) }
})
// ❌ slot typo inside a variant
Style.make(ButtonKit)({
  // @ts-expect-error
  variants: { tone: Variant.make(Tone, { primary: { rot: {} }, neutral: {}, danger: {} }) }
})
// ❌ no such token
// @ts-expect-error
Colors.primary
// ❌ raw value where a token is required
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { background: "#ff0000" } } })
// ❌ wrong token kind (Length where Color expected)
// @ts-expect-error
Style.make(ButtonKit)({ base: { root: { color: Spacing[2] } } })
// ❌ theme overriding a group it didn't list
// @ts-expect-error
Theme.make({ Colors }, { Spacing: { 2: 4 } }, { name: "x" })
// ❌ wrong Msg type for onPress
// @ts-expect-error
Button(h, { onPress: "nope", children: "x" })
