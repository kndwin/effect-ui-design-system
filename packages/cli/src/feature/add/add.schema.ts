import { Schema } from "effect"
import { ExportsSchema } from "../../platform/recipe/recipe.schema.ts"

export const GetComponentPathInputSchema = Schema.Struct({ exports: ExportsSchema, name: Schema.String })
export type GetComponentPathInput = typeof GetComponentPathInputSchema.Type

export const GetComponentNamesInputSchema = Schema.Struct({ exports: ExportsSchema })
export type GetComponentNamesInput = typeof GetComponentNamesInputSchema.Type

export const AddOptionsSchema = Schema.Struct({
  names: Schema.Array(Schema.String),
  dir: Schema.String,
  overwrite: Schema.Boolean
})
export type AddOptions = typeof AddOptionsSchema.Type
