import { Schema } from "effect"

export const MenuItemSchema = Schema.Struct({
  value: Schema.String,
  label: Schema.String,
  disabled: Schema.optional(Schema.Boolean),
  danger: Schema.optional(Schema.Boolean)
})
export type MenuItem = typeof MenuItemSchema.Type
