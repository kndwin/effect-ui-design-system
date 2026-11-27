import { Schema } from "effect"

export const ComposeOutputInput = Schema.Struct({ value: Schema.Unknown, exportName: Schema.String })
export type ComposeOutputInput = typeof ComposeOutputInput.Type
