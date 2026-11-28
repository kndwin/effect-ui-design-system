import { UiSchema } from "@effect/ui"
import { ChoicesSchema } from "@weft/components/CustomizeSchema"
import { Schema } from "effect"
import { ModeSchema, VarsSchema } from "../../platform/theme/theme.schema.ts"

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

export const IsCustomizedInputSchema = Schema.Struct({ choices: ChoicesSchema })
export type IsCustomizedInput = typeof IsCustomizedInputSchema.Type

export const GetCustomThemeCommandInputSchema = Schema.Struct({ theme: Schema.String, choices: ChoicesSchema })
export type GetCustomThemeCommandInput = typeof GetCustomThemeCommandInputSchema.Type

export const MapVarsToInlineStyleInputSchema = Schema.Struct({ vars: VarsSchema })
export type MapVarsToInlineStyleInput = typeof MapVarsToInlineStyleInputSchema.Type
