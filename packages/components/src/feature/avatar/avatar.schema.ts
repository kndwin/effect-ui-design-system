import { Schema } from "effect"

export const AvatarOptionsSchema = Schema.Struct({
  name: Schema.String,
  src: Schema.optional(Schema.String),
  fallbackDelay: Schema.optional(Schema.Number),
  key: Schema.optional(Schema.String),
  class: Schema.optional(Schema.String)
})
export type AvatarOptions = typeof AvatarOptionsSchema.Type

export const MapNameToInitialsInputSchema = Schema.Struct({ name: Schema.String })
export type MapNameToInitialsInput = typeof MapNameToInitialsInputSchema.Type
