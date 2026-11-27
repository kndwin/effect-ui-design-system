import { Duration, Option, Schema, SchemaTransformation } from "effect"
import * as Token from "./token.pure.ts"

export const ValueSchema = Schema.String.pipe(
  Schema.check(
    Schema.makeFilter(
      (u) =>
        Option.isSome(Duration.fromInput(u as Duration.Input)) || 'expected an Effect DurationInput, e.g. "150 millis"'
    )
  ),
  Schema.decodeTo(
    Schema.String,
    SchemaTransformation.transform<string, string>({
      decode: (v) => `${Duration.toMillis(v as Duration.Input)}ms`,
      encode: (v) => v
    })
  )
) as unknown as Schema.Codec<string, Duration.Input & string>

export const make = Token.composeTokenKind({ kind: "Duration", value: ValueSchema })
