import { Schema } from "effect"

export const PageSchema = Schema.Struct({
  id: Schema.String,
  section: Schema.Literals(["Getting started", "Components", "Foundations"]),
  title: Schema.String,
  lead: Schema.String,
  kit: Schema.optionalKey(Schema.String),
  style: Schema.optionalKey(Schema.String),
  styleFile: Schema.optionalKey(Schema.String)
})
export type Page = typeof PageSchema.Type
