import { Schema } from "effect"

export const Options = Schema.Struct({ include: Schema.instanceOf(RegExp), adapter: Schema.String })
export type Options = typeof Options.Type
