import { Schema, SchemaTransformation } from "effect"
import * as Token from "./token.pure.ts"

export const ValueSchema = Schema.Number.check(Schema.isBetween({ minimum: 100, maximum: 900 })).pipe(
  Schema.decodeTo(Schema.String, SchemaTransformation.transform<string, number>({ decode: String, encode: Number }))
) as unknown as Schema.Codec<string, number>

export const make = Token.composeTokenKind({ kind: "Weight", value: ValueSchema })
