import { UiSchema } from "@effect/ui"
import { Schema } from "effect"

export const ThemeTabsPropsSchema = Schema.Struct({
  theme: Schema.String,
  customized: Schema.Boolean,
  custom: Schema.String
})
export type ThemeTabsProps = typeof ThemeTabsPropsSchema.Type

export const ThemeTabsModelSchema = Schema.Struct({ tab: Schema.NullOr(Schema.String) })
export type ThemeTabsModel = typeof ThemeTabsModelSchema.Type

export const ThemeTabsMessageSchema = UiSchema.TaggedEnum({
  PressedTab: { value: Schema.String },
  PressedCustomize: {}
})

export const ThemeTabsEventsSchema = UiSchema.TaggedEnum({ OpenedPanel: {} })
