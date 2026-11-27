import { UiSchema } from "@effect/ui"
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
