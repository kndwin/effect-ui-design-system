import { Schema } from "effect"
import { ModeSchema } from "../theme/theme.schema.ts"

export const ExamplePropsSchema = Schema.Struct({
  id: Schema.String,
  theme: Schema.String,
  mode: ModeSchema,
  style: Schema.optional(Schema.String)
})
export type ExampleProps = typeof ExamplePropsSchema.Type

export const ExampleModelSchema = Schema.Struct({})

export const MapSourceToExampleMetaInputSchema = Schema.Struct({ source: Schema.String, file: Schema.String })
export type MapSourceToExampleMetaInput = typeof MapSourceToExampleMetaInputSchema.Type

export const ExampleMetaSchema = Schema.Struct({ title: Schema.String, order: Schema.Number })
export type ExampleMeta = typeof ExampleMetaSchema.Type
