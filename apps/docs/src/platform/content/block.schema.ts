import { Schema } from "effect"

export const LanguageSchema = Schema.Literals(["ts", "shell", "plain"])

export const TextBlockSchema = Schema.TaggedStruct("Text", { text: Schema.String })

export const NoticeBlockSchema = Schema.TaggedStruct("Notice", { text: Schema.String })

export const CodeBlockSchema = Schema.TaggedStruct("Code", {
  code: Schema.String,
  title: Schema.optionalKey(Schema.String),
  language: Schema.optionalKey(LanguageSchema),
  lineNumbers: Schema.optionalKey(Schema.Boolean),
  collapsible: Schema.optionalKey(Schema.Boolean)
})

export const CardsBlockSchema = Schema.TaggedStruct("Cards", {
  cards: Schema.Array(Schema.Struct({ title: Schema.String, text: Schema.String, mono: Schema.Boolean }))
})

export const BlockSchema = Schema.Union([TextBlockSchema, NoticeBlockSchema, CodeBlockSchema, CardsBlockSchema])
export type Block = typeof BlockSchema.Type

export const ContentSectionSchema = Schema.Struct({ heading: Schema.String, blocks: Schema.Array(BlockSchema) })
export type ContentSection = typeof ContentSectionSchema.Type
