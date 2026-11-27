import { Schema } from "effect"

const Vars = Schema.Record(Schema.String, Schema.String)

export const ThemeData = Schema.Struct({
  "~acme": Schema.Literal("Theme"),
  name: Schema.String,
  rules: Schema.Array(Schema.Struct({ selector: Schema.String, vars: Vars })),
  modes: Schema.Array(Schema.String),
  vars: Schema.Struct({ base: Vars, modes: Schema.Record(Schema.String, Vars) })
})
export type ThemeData = typeof ThemeData.Type
