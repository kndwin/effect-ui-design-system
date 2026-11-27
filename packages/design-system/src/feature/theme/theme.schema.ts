import { Schema } from "effect"

const VarsSchema = Schema.Record(Schema.String, Schema.String)

export const ThemeDataSchema = Schema.Struct({
  "~weft": Schema.Literal("Theme"),
  name: Schema.String,
  rules: Schema.Array(Schema.Struct({ selector: Schema.String, vars: VarsSchema })),
  modes: Schema.Array(Schema.String),
  vars: Schema.Struct({ base: VarsSchema, modes: Schema.Record(Schema.String, VarsSchema) })
})
export type ThemeData = typeof ThemeDataSchema.Type
