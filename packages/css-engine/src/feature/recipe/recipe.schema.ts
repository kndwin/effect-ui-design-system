import { Schema } from "effect"
import { RecipeSchema } from "../../platform/rules/rules.schema.ts"
import { RecipeRuntimeSchema } from "../../platform/rules/runtime.schema.ts"

export const CompiledRecipeSchema = Schema.Struct({ css: Schema.Array(Schema.String), runtime: RecipeRuntimeSchema })
export type CompiledRecipe = typeof CompiledRecipeSchema.Type

export const MapRecipeToCompiledRecipeInputSchema = Schema.Struct({
  recipe: RecipeSchema,
  scope: Schema.String,
  debug: Schema.Boolean
})
export type MapRecipeToCompiledRecipeInput = typeof MapRecipeToCompiledRecipeInputSchema.Type
