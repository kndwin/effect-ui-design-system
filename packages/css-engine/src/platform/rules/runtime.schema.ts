import { Schema } from "effect"

export const RecipeRuntimeSchema = Schema.Struct({
  base: Schema.String,
  variants: Schema.Record(Schema.String, Schema.Record(Schema.String, Schema.String)),
  defaults: Schema.Record(Schema.String, Schema.String),
  compound: Schema.Array(
    Schema.Struct({ variants: Schema.Record(Schema.String, Schema.String), className: Schema.String })
  )
})
export type RecipeRuntime = typeof RecipeRuntimeSchema.Type

export const ComposeRecipeInputSchema = Schema.Struct({ runtime: RecipeRuntimeSchema })
export type ComposeRecipeInput = typeof ComposeRecipeInputSchema.Type

export const RecipePropsSchema = Schema.Record(Schema.String, Schema.Unknown)
export type RecipeProps = typeof RecipePropsSchema.Type
