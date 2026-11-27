import { Schema, SchemaTransformation } from "effect"
import * as Token from "./Token.pure.ts"

export const Value = Schema.Array(Schema.String)
  .check(Schema.isMinLength(1))
  .pipe(
    Schema.decodeTo(
      Schema.String,
      SchemaTransformation.transform<string, ReadonlyArray<string>>({
        decode: (stack) => stack.map((f) => (/^[a-z-]+$/.test(f) ? f : JSON.stringify(f))).join(", "),
        encode: (s) => s.split(", ")
      })
    )
  ) as unknown as Schema.Codec<string, ReadonlyArray<string>>

export const make = Token.kind("Font", Value)
