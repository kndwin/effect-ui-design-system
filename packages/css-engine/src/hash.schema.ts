import { Schema } from "effect"

export const GetHashInput = Schema.Struct({ input: Schema.String })
export type GetHashInput = typeof GetHashInput.Type

export const GetClassNameInput = Schema.Struct({
  scope: Schema.String,
  debugId: Schema.String,
  key: Schema.String,
  debug: Schema.Boolean
})
export type GetClassNameInput = typeof GetClassNameInput.Type
