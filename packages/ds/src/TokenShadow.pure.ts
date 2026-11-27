import { Schema } from "effect"
import * as Token from "./Token.pure.ts"

/** A full box-shadow value. Opaque: themes own it, components only reference it. */
export const Value = Schema.String.check(
  Schema.isPattern(/^(none|(inset\s+)?-?[\d.]+(px|rem)?\s.+)$/, { message: "expected a box-shadow value or none" })
)

export const make = Token.kind("Shadow", Value)
