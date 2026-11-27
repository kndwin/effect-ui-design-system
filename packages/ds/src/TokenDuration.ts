import { Duration, Schema, SchemaTransformation } from "effect"
import * as Token from "./Token.ts"

/** An Effect DurationInput ("150 millis", "0.2 seconds") → "150ms" */
export const Value = Schema.String.pipe(
  Schema.check(Schema.makeFilter((u) => Duration.fromInput(u as Duration.Input)._tag === "Some" || "expected an Effect DurationInput, e.g. \"150 millis\"")),
  Schema.decodeTo(
    Schema.String,
    SchemaTransformation.transform<string, string>({
      decode: (v) => `${Duration.toMillis(v as Duration.Input)}ms`,
      encode: (v) => v
    })
  )
) as unknown as Schema.Codec<string, Duration.Input & string>

export const make = Token.kind("Duration", Value)
