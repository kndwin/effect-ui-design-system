import { Schema } from "effect"

export const ComposeOutputInputSchema = Schema.Struct({ value: Schema.Unknown, exportName: Schema.String })
export type ComposeOutputInput = typeof ComposeOutputInputSchema.Type
