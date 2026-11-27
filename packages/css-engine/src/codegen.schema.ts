import { Schema } from "effect"
import { RecipeRuntime } from "./runtime.schema.ts"

export const CompiledExport = Schema.Union([
  Schema.Struct({ name: Schema.String, value: Schema.Unknown }),
  Schema.Struct({
    name: Schema.String,
    runtime: Schema.Record(Schema.String, Schema.Unknown),
    recipesAt: Schema.UndefinedOr(Schema.String),
    recipes: Schema.Record(Schema.String, RecipeRuntime)
  })
])
export type CompiledExport = typeof CompiledExport.Type

export const GetModuleSourceInput = Schema.Struct({
  exports: Schema.Array(CompiledExport),
  imports: Schema.Struct({ css: Schema.String, runtime: Schema.String })
})
export type GetModuleSourceInput = typeof GetModuleSourceInput.Type
