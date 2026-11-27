import { Schema } from "effect"

export const Language = Schema.Literals(["ts", "shell", "plain"])
export type Language = typeof Language.Type

export const TokenKind = Schema.Literals(["comment", "string", "keyword", "number", "type", "call", "plain"])
export type TokenKind = typeof TokenKind.Type

export const HighlightToken = Schema.Tuple([TokenKind, Schema.String])
export type HighlightToken = typeof HighlightToken.Type

export const GetHighlightTokensInput = Schema.Struct({ code: Schema.String, language: Schema.optionalKey(Language) })
export type GetHighlightTokensInput = typeof GetHighlightTokensInput.Type

export const LineMark = Schema.Literals(["added", "removed", "highlighted"])
export type LineMark = typeof LineMark.Type

export const CodeBlockOptions = Schema.Struct({
  code: Schema.String,
  title: Schema.optional(Schema.String),
  language: Schema.optional(Language),
  lineNumbers: Schema.optional(Schema.Boolean),
  startLine: Schema.optional(Schema.Number),
  marks: Schema.optional(Schema.Record(Schema.String, LineMark)),
  wrap: Schema.optional(Schema.Boolean),
  copy: Schema.optional(Schema.Boolean),
  key: Schema.optional(Schema.String),
  class: Schema.optional(Schema.String)
})
export type CodeBlockOptions = typeof CodeBlockOptions.Type
