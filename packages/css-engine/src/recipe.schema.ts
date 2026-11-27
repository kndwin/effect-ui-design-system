import { Schema } from "effect"
import { Recipe } from "./rules.schema.ts"
import { RecipeRuntime } from "./runtime.schema.ts"

export const CompiledRecipe = Schema.Struct({ css: Schema.Array(Schema.String), runtime: RecipeRuntime })
export type CompiledRecipe = typeof CompiledRecipe.Type

export const GetCompiledRecipeInput = Schema.Struct({ recipe: Recipe, scope: Schema.String, debug: Schema.Boolean })
export type GetCompiledRecipeInput = typeof GetCompiledRecipeInput.Type
