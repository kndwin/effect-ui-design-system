import { UiSchema } from "@effect/ui"
import { Schema } from "effect"
import { ModeSchema } from "../theme/theme.schema.ts"

export const TabSchema = Schema.Literals(["preview", "code"])
export type Tab = typeof TabSchema.Type

export const ExamplePropsSchema = Schema.Struct({
  id: Schema.String,
  theme: Schema.String,
  mode: ModeSchema,
  style: Schema.optional(Schema.String),
  initialTab: TabSchema
})
export type ExampleProps = typeof ExamplePropsSchema.Type

export const ExampleModelSchema = Schema.Struct({ tab: TabSchema })

export const ExampleMessageSchema = UiSchema.TaggedEnum({ PressedTab: { tab: TabSchema } })

export const MapSourceToExampleMetaInputSchema = Schema.Struct({ source: Schema.String, file: Schema.String })
export type MapSourceToExampleMetaInput = typeof MapSourceToExampleMetaInputSchema.Type

export const ExampleMetaSchema = Schema.Struct({ title: Schema.String, order: Schema.Number })
export type ExampleMeta = typeof ExampleMetaSchema.Type
