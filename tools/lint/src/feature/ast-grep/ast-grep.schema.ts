import { Schema } from "effect"

export const FindingSchema = Schema.Struct({
  ruleId: Schema.String,
  file: Schema.String,
  line: Schema.Number,
  message: Schema.String
})
export type Finding = typeof FindingSchema.Type

export const AstGrepOutputSchema = Schema.fromJsonString(
  Schema.Array(
    Schema.Struct({
      ruleId: Schema.String,
      file: Schema.String,
      message: Schema.String,
      range: Schema.Struct({ start: Schema.Struct({ line: Schema.Number }) })
    })
  )
)
