import { Schema } from "effect"

export const MapStringToHashInputSchema = Schema.Struct({ input: Schema.String })
export type MapStringToHashInput = typeof MapStringToHashInputSchema.Type

export const GetClassNameInputSchema = Schema.Struct({
  scope: Schema.String,
  debugId: Schema.String,
  key: Schema.String,
  debug: Schema.Boolean
})
export type GetClassNameInput = typeof GetClassNameInputSchema.Type
