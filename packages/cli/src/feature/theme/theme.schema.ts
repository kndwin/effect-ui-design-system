import { Schema } from "effect"

export const MapThemeToRecipeSourceInputSchema = Schema.Struct({
  source: Schema.String,
  base: Schema.String,
  name: Schema.String,
  tokensImport: Schema.String
})
export type MapThemeToRecipeSourceInput = typeof MapThemeToRecipeSourceInputSchema.Type

export const MapNameToIdentifierInputSchema = Schema.Struct({ name: Schema.String })
export type MapNameToIdentifierInput = typeof MapNameToIdentifierInputSchema.Type

export const ThemeOptionsSchema = Schema.Struct({
  base: Schema.String,
  name: Schema.String,
  dir: Schema.String,
  ui: Schema.String,
  overwrite: Schema.Boolean,
  choices: Schema.Option(Schema.String)
})
export type ThemeOptions = typeof ThemeOptionsSchema.Type
