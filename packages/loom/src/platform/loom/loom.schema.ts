import { Schema } from "effect"

export const ArgsSchema = Schema.Record(Schema.String, Schema.Unknown)
export type Args = typeof ArgsSchema.Type

export const ScenarioWithArgsSchema = Schema.Struct({
  args: Schema.Record(Schema.String, Schema.Unknown),
  steps: Schema.Array(Schema.Unknown)
})
export type ScenarioWithArgs = typeof ScenarioWithArgsSchema.Type
