import { Schema, SchemaTransformation } from "effect"
import * as Token from "./token.pure.ts"

export const Value = Schema.Union([
  Schema.Number,
  Schema.String.check(Schema.isPattern(/^-?\d*\.?\d+(px|rem)$/, { message: "expected <n>px or <n>rem" }))
]).pipe(
  Schema.decodeTo(
    Schema.String,
    SchemaTransformation.transform<string, number | string>({
      decode: (v) => (typeof v === "number" ? `${v}px` : v),
      encode: (v) => v
    }) as any
  )
) as unknown as Schema.Codec<string, number | `${number}px` | `${number}rem`>

export const make = Token.kind("Length", Value)

export const calc = (
  strings: TemplateStringsArray,
  ...tokens: ReadonlyArray<Token.Ref<"Length">>
): Token.Ref<"Length"> =>
  `calc(${strings.reduce((out, part, i) => out + part + (tokens[i] ?? ""), "")})` as Token.Ref<"Length">
