import { UiSchema } from "@effect/ui"
import { ThemeDataSchema } from "@acme/design-system/ThemeSchema"
import { Schema } from "effect"

export const ModeSchema = Schema.Literals(["light", "dark"])
export type Mode = typeof ModeSchema.Type
export const TabSchema = Schema.Literals(["preview", "code", "themes"])
export type Tab = typeof TabSchema.Type

export const ChoicesSchema = Schema.Struct({
  accent: Schema.NullOr(Schema.String),
  neutrals: Schema.NullOr(Schema.String),
  radius: Schema.NullOr(Schema.String),
  sizing: Schema.NullOr(Schema.String),
  font: Schema.NullOr(Schema.String),
  mono: Schema.NullOr(Schema.String),
  scale: Schema.Number
})

export const MsgSchema = UiSchema.TaggedEnum({
  Navigated: { page: Schema.String },
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: ModeSchema },
  ToggledMode: {},
  PickedTab: { id: Schema.String, tab: TabSchema },
  ToggledPanel: {},
  Chose: { choices: ChoicesSchema },
  ResetChoices: {}
})

export const ModelSchema = Schema.Struct({
  page: Schema.String,
  theme: Schema.String,
  mode: ModeSchema,
  tabs: Schema.Record(Schema.String, TabSchema),
  panel: Schema.Boolean,
  choices: ChoicesSchema
})
export type Model = typeof ModelSchema.Type
export type Choices = typeof ChoicesSchema.Type

export const VarsSchema = Schema.Record(Schema.String, Schema.String)
export type Vars = typeof VarsSchema.Type

export const GetThemeVarsInputSchema = Schema.Struct({ theme: ThemeDataSchema, mode: ModeSchema })
export type GetThemeVarsInput = typeof GetThemeVarsInputSchema.Type

export const GetControlsInputSchema = Schema.Struct({ themes: Schema.Array(ThemeDataSchema) })
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

export const MapVarsToInlineStyleInputSchema = Schema.Struct({ vars: VarsSchema })
export type MapVarsToInlineStyleInput = typeof MapVarsToInlineStyleInputSchema.Type

export const PageSchema = Schema.Struct({
  id: Schema.String,
  section: Schema.Literals(["Getting started", "Components", "Foundations"]),
  title: Schema.String,
  lead: Schema.String,
  kit: Schema.optionalKey(Schema.String),
  style: Schema.optionalKey(Schema.String),
  styleFile: Schema.optionalKey(Schema.String)
})
export type Page = typeof PageSchema.Type
