import { Schema } from "effect"
import { RecipeRuntimeSchema } from "./runtime.schema.ts"

export const CompiledExportSchema = Schema.Union([
  Schema.Struct({ name: Schema.String, value: Schema.Unknown }),
  Schema.Struct({
    name: Schema.String,
    runtime: Schema.Record(Schema.String, Schema.Unknown),
    recipesAt: Schema.UndefinedOr(Schema.String),
    recipes: Schema.Record(Schema.String, RecipeRuntimeSchema)
  })
])
export type CompiledExport = typeof CompiledExportSchema.Type

export const MapExportsToModuleSourceInputSchema = Schema.Struct({
  exports: Schema.Array(CompiledExportSchema),
  imports: Schema.Struct({ css: Schema.String, runtime: Schema.String })
})
export type MapExportsToModuleSourceInput = typeof MapExportsToModuleSourceInputSchema.Type
