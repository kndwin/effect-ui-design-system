import { Schema } from "effect"
import * as Token from "./token.pure.ts"

export const Value = Schema.String.check(
  Schema.isPattern(/^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|rgba|hsl|hsla|oklch)\(.+\))$/i, {
    message: "expected #hex, rgb(), hsl() or oklch()"
  })
)

export const make = Token.composeTokenKind({ kind: "Color", value: Value })

export const alpha = <E extends string>(
  color: Token.Ref<"Color", E>,
  percent: number
): Token.Ref<"Color", `color-mix(in oklab, ${E} ${number}%, transparent)`> =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)` as any
