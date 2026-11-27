import { Schema, SchemaTransformation } from "effect"
import * as Token from "./Token.pure.ts"

/** A font weight, 100–900 */
export const Value = Schema.Number.check(Schema.isBetween({ minimum: 100, maximum: 900 })).pipe(
  Schema.decodeTo(Schema.String, SchemaTransformation.transform<string, number>({ decode: String, encode: Number }))
) as unknown as Schema.Codec<string, number>

export const make = Token.kind("Weight", Value)
