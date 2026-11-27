import { Schema } from "effect"

export const RecipeRuntime = Schema.Struct({
  base: Schema.String,
  variants: Schema.Record(Schema.String, Schema.Record(Schema.String, Schema.String)),
  defaults: Schema.Record(Schema.String, Schema.String),
  compound: Schema.Array(
    Schema.Struct({ variants: Schema.Record(Schema.String, Schema.String), className: Schema.String })
  )
})
export type RecipeRuntime = typeof RecipeRuntime.Type

export const ComposeRecipeInput = Schema.Struct({ runtime: RecipeRuntime })
export type ComposeRecipeInput = typeof ComposeRecipeInput.Type

export const RecipeProps = Schema.Record(Schema.String, Schema.Unknown)
export type RecipeProps = typeof RecipeProps.Type
