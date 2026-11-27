import { Schema } from "effect"
import * as Token from "./Token.ts"

/** "#hex" | "rgb()" | "hsl()" | "oklch()" */
export const Value = Schema.String.check(
  Schema.isPattern(/^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|rgba|hsl|hsla|oklch)\(.+\))$/i, {
    message: "expected #hex, rgb(), hsl() or oklch()"
  })
)

/** `TokenColor.make("color", ["surface", "fg", "accent"])` → `Colors.accent` = `var(--color-accent)` */
export const make = Token.kind("Color", Value)

/** `bg-primary/90` → `TokenColor.alpha(Colors.primary, 90)`. Still a Color ref, so still checked. */
export const alpha = <E extends string>(
  color: Token.Ref<"Color", E>,
  percent: number
): Token.Ref<"Color", `color-mix(in oklab, ${E} ${number}%, transparent)`> =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)` as any
