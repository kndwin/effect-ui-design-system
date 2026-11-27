import { ThemeDataSchema } from "@weft/design-system/ThemeSchema"
import { Schema } from "effect"

export const ModeSchema = Schema.Literals(["light", "dark"])
export type Mode = typeof ModeSchema.Type

export const VarsSchema = Schema.Record(Schema.String, Schema.String)
export type Vars = typeof VarsSchema.Type

export const ChoicesSchema = Schema.Struct({
  custom: Schema.Boolean,
  accent: Schema.NullOr(Schema.String),
  radius: Schema.NullOr(Schema.String),
  sizing: Schema.NullOr(Schema.String),
  font: Schema.NullOr(Schema.String),
  mono: Schema.NullOr(Schema.String),
  scale: Schema.Number
})
export type Choices = typeof ChoicesSchema.Type

export const ChoiceKeySchema = Schema.Literals(["accent", "radius", "sizing", "font", "mono"])
export type ChoiceKey = typeof ChoiceKeySchema.Type

export const GetThemeVarsInputSchema = Schema.Struct({ theme: ThemeDataSchema, mode: ModeSchema })
export type GetThemeVarsInput = typeof GetThemeVarsInputSchema.Type

export const GetControlsInputSchema = Schema.Struct({ themes: Schema.Array(ThemeDataSchema), theme: ThemeDataSchema })
export type GetControlsInput = typeof GetControlsInputSchema.Type

export const GetOverridesInputSchema = Schema.Struct({
  choices: ChoicesSchema,
  themes: Schema.Array(ThemeDataSchema),
  theme: ThemeDataSchema,
  mode: ModeSchema
})
export type GetOverridesInput = typeof GetOverridesInputSchema.Type

export const GetCustomThemeSourceInputSchema = Schema.Struct({
  choices: ChoicesSchema,
  themes: Schema.Array(ThemeDataSchema),
  theme: ThemeDataSchema,
  name: Schema.String,
  tokensImport: Schema.String
})
export type GetCustomThemeSourceInput = typeof GetCustomThemeSourceInputSchema.Type

export const MapChoicesToArgumentInputSchema = Schema.Struct({ choices: ChoicesSchema })
export type MapChoicesToArgumentInput = typeof MapChoicesToArgumentInputSchema.Type

export const MapArgumentToChoicesInputSchema = Schema.Struct({ argument: Schema.String })
export type MapArgumentToChoicesInput = typeof MapArgumentToChoicesInputSchema.Type
