import { Match, Schema, SchemaTransformation } from "effect"
import * as Token from "./token.pure.ts"

export const Value = Schema.Array(Schema.String)
  .check(Schema.isMinLength(1))
  .pipe(
    Schema.decodeTo(
      Schema.String,
      SchemaTransformation.transform<string, ReadonlyArray<string>>({
        decode: (stack) =>
          stack
            .map((f) =>
              Match.value(/^[a-z-]+$/.test(f)).pipe(
                Match.when(true, () => f),
                Match.orElse(() => JSON.stringify(f))
              )
            )
            .join(", "),
        encode: (s) => s.split(", ")
      })
    )
  ) as unknown as Schema.Codec<string, ReadonlyArray<string>>

export const make = Token.composeTokenKind({ kind: "Font", value: Value })
