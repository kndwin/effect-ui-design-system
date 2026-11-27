import { Schema } from "effect"

export const LanguageSchema = Schema.Literals(["ts", "shell", "plain"])
export type Language = typeof LanguageSchema.Type

export const TokenKindSchema = Schema.Literals(["comment", "string", "keyword", "number", "type", "call", "plain"])
export type TokenKind = typeof TokenKindSchema.Type

export const HighlightTokenSchema = Schema.Tuple([TokenKindSchema, Schema.String])
export type HighlightToken = typeof HighlightTokenSchema.Type

export const MapCodeToHighlightTokensInputSchema = Schema.Struct({
  code: Schema.String,
  language: Schema.optionalKey(LanguageSchema)
})
export type MapCodeToHighlightTokensInput = typeof MapCodeToHighlightTokensInputSchema.Type

export const LineMarkSchema = Schema.Literals(["added", "removed", "highlighted"])
export type LineMark = typeof LineMarkSchema.Type

export const CodeBlockOptionsSchema = Schema.Struct({
  code: Schema.String,
  title: Schema.optional(Schema.String),
  language: Schema.optional(LanguageSchema),
  lineNumbers: Schema.optional(Schema.Boolean),
  startLine: Schema.optional(Schema.Number),
  marks: Schema.optional(Schema.Record(Schema.String, LineMarkSchema)),
  wrap: Schema.optional(Schema.Boolean),
  copy: Schema.optional(Schema.Boolean),
  key: Schema.optional(Schema.String),
  class: Schema.optional(Schema.String)
})
export type CodeBlockOptions = typeof CodeBlockOptionsSchema.Type
