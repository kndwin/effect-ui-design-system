import { UiSchema } from "@effect/ui"
import { ThemeDataSchema } from "@weft/design-system/ThemeSchema"
import { Schema } from "effect"
import { ModeSchema, VarsSchema } from "../../platform/theme/theme.schema.ts"

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

export const ThemeBuilderPropsSchema = Schema.Struct({
  theme: Schema.String,
  mode: ModeSchema,
  choices: ChoicesSchema
})
export type ThemeBuilderProps = typeof ThemeBuilderPropsSchema.Type

export const ThemeBuilderEventsSchema = UiSchema.TaggedEnum({
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: ModeSchema },
  Chose: { choices: ChoicesSchema },
  Reset: {},
  Closed: {}
})
export type ThemeBuilderEvent = typeof ThemeBuilderEventsSchema.Type

export const ThemeBuilderMessageSchema = UiSchema.TaggedEnum({
  PressedTheme: { theme: Schema.String },
  PressedMode: { mode: ModeSchema },
  PressedChoice: { choices: ChoicesSchema },
  PressedReset: {},
  PressedClose: {}
})
export type ThemeBuilderMessage = typeof ThemeBuilderMessageSchema.Type

export const ThemeBuilderModelSchema = Schema.Struct({})

export const GetControlsInputSchema = Schema.Struct({ themes: Schema.Array(ThemeDataSchema), theme: ThemeDataSchema })
export type GetControlsInput = typeof GetControlsInputSchema.Type

export const IsCustomizedInputSchema = Schema.Struct({ choices: ChoicesSchema })
export type IsCustomizedInput = typeof IsCustomizedInputSchema.Type

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
  theme: ThemeDataSchema
})
export type GetCustomThemeSourceInput = typeof GetCustomThemeSourceInputSchema.Type

export const MapVarsToInlineStyleInputSchema = Schema.Struct({ vars: VarsSchema })
export type MapVarsToInlineStyleInput = typeof MapVarsToInlineStyleInputSchema.Type
