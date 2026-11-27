import { Schema } from "effect"

export const PartSpecSchema = Schema.Struct({ states: Schema.Record(Schema.String, Schema.String) })
export type PartSpec = typeof PartSpecSchema.Type
