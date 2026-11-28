import { Schema } from "effect"

export const MapGlobToRegExpInputSchema = Schema.Struct({ glob: Schema.String })
export type MapGlobToRegExpInput = typeof MapGlobToRegExpInputSchema.Type

export const GetGlobBaseInputSchema = Schema.Struct({ glob: Schema.String })
export type GetGlobBaseInput = typeof GetGlobBaseInputSchema.Type

export const GetEntrySourceInputSchema = Schema.Struct({
  config: Schema.NullOr(Schema.String),
  files: Schema.Array(Schema.String)
})
export type GetEntrySourceInput = typeof GetEntrySourceInputSchema.Type

export const GetPageHtmlInputSchema = Schema.Struct({ entry: Schema.String })
export type GetPageHtmlInput = typeof GetPageHtmlInputSchema.Type
