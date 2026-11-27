import { Schema } from "effect"

export const AvatarOptions = Schema.Struct({
  name: Schema.String,
  src: Schema.optional(Schema.String),
  fallbackDelay: Schema.optional(Schema.Number),
  key: Schema.optional(Schema.String),
  class: Schema.optional(Schema.String)
})
export type AvatarOptions = typeof AvatarOptions.Type

export const GetInitialsInput = Schema.Struct({ name: Schema.String })
export type GetInitialsInput = typeof GetInitialsInput.Type
