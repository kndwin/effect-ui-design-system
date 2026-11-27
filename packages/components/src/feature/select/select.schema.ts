import { UiSchema } from "@effect/ui"
import { Schema } from "effect"

export const SelectItemSchema = Schema.Struct({
  value: Schema.String,
  label: Schema.String,
  disabled: Schema.optional(Schema.Boolean)
})
export type SelectItem = typeof SelectItemSchema.Type

export const SelectClassesSchema = Schema.Struct({
  root: Schema.String,
  trigger: Schema.String,
  value: Schema.String,
  icon: Schema.String,
  positioner: Schema.String,
  popup: Schema.String,
  item: Schema.String,
  indicator: Schema.String
})

export const SelectPropsSchema = Schema.Struct({
  label: Schema.String,
  value: Schema.NullOr(Schema.String),
  items: Schema.Array(SelectItemSchema),
  placeholder: Schema.optional(Schema.String),
  disabled: Schema.optional(Schema.Boolean),
  name: Schema.optional(Schema.String),
  extraClass: Schema.optional(Schema.String),
  classes: SelectClassesSchema
})

export const SelectModelSchema = Schema.Struct({ open: Schema.Boolean })

export const SelectMessageSchema = UiSchema.TaggedEnum({
  RequestedOpen: {},
  RequestedClose: {},
  PickedValue: { value: Schema.NullOr(Schema.String) }
})

export const SelectEventsSchema = UiSchema.TaggedEnum({ Picked: { value: Schema.NullOr(Schema.String) } })
