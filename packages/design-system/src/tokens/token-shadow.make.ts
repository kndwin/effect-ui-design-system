import { Schema } from "effect"
import * as Token from "./token.pure.ts"

export const Value = Schema.String.check(
  Schema.isPattern(/^(none|(inset\s+)?-?[\d.]+(px|rem)?\s.+)$/, { message: "expected a box-shadow value or none" })
)

export const make = Token.composeTokenKind({ kind: "Shadow", value: Value })
