import { Schema } from "effect"

export const HostArgsSchema = Schema.Record(Schema.String, Schema.Unknown)
export type HostArgs = typeof HostArgsSchema.Type

export const HostPropsSchema = Schema.Struct({ loom: Schema.Any, args: Schema.Record(Schema.String, Schema.Unknown) })

export const HostModelSchema = Schema.Record(Schema.String, Schema.Unknown)

export const HostMessageSchema = Schema.Record(Schema.String, Schema.Unknown)
