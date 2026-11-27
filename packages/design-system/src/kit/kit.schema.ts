import { Schema } from "effect"

export const PartSpec = Schema.Struct({ states: Schema.Record(Schema.String, Schema.String) })
export type PartSpec = typeof PartSpec.Type
