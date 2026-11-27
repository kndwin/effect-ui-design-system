import { Schema } from "effect"

export const OptionsSchema = Schema.Struct({ include: Schema.instanceOf(RegExp), adapter: Schema.String })
export type Options = typeof OptionsSchema.Type
