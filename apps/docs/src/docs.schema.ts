import { UiSchema } from "@effect/ui"
import { ThemeData } from "@acme/design-system/ThemeSchema"
import { Schema } from "effect"

export const Mode = Schema.Literals(["light", "dark"])
export type Mode = typeof Mode.Type
export const Tab = Schema.Literals(["preview", "code", "themes"])
export type Tab = typeof Tab.Type

export const Choices = Schema.Struct({
  accent: Schema.NullOr(Schema.String),
  neutrals: Schema.NullOr(Schema.String),
  radius: Schema.NullOr(Schema.String),
  sizing: Schema.NullOr(Schema.String),
  font: Schema.NullOr(Schema.String),
  mono: Schema.NullOr(Schema.String),
  scale: Schema.Number
})

export const Msg = UiSchema.TaggedEnum({
  Navigated: { page: Schema.String },
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: Mode },
  ToggledMode: {},
  PickedTab: { id: Schema.String, tab: Tab },
  ToggledPanel: {},
  Chose: { choices: Choices },
  ResetChoices: {}
})

export const Model = Schema.Struct({
  page: Schema.String,
  theme: Schema.String,
  mode: Mode,
  tabs: Schema.Record(Schema.String, Tab),
  panel: Schema.Boolean,
  choices: Choices
})
export type Model = typeof Model.Type
export type Choices = typeof Choices.Type

export const Vars = Schema.Record(Schema.String, Schema.String)
export type Vars = typeof Vars.Type

export const GetThemeVarsInput = Schema.Struct({ theme: ThemeData, mode: Mode })
export type GetThemeVarsInput = typeof GetThemeVarsInput.Type

export const GetControlsInput = Schema.Struct({ themes: Schema.Array(ThemeData) })
export type GetControlsInput = typeof GetControlsInput.Type

export const IsCustomizedInput = Schema.Struct({ choices: Choices })
export type IsCustomizedInput = typeof IsCustomizedInput.Type

export const GetOverridesInput = Schema.Struct({
  choices: Choices,
  themes: Schema.Array(ThemeData),
  theme: ThemeData,
  mode: Mode
})
export type GetOverridesInput = typeof GetOverridesInput.Type

export const ComposeInlineStyleInput = Schema.Struct({ vars: Vars })
export type ComposeInlineStyleInput = typeof ComposeInlineStyleInput.Type

export const Page = Schema.Struct({
  id: Schema.String,
  section: Schema.Literals(["Getting started", "Components", "Foundations"]),
  title: Schema.String,
  lead: Schema.String,
  kit: Schema.optionalKey(Schema.String),
  style: Schema.optionalKey(Schema.String),
  styleFile: Schema.optionalKey(Schema.String)
})
export type Page = typeof Page.Type
