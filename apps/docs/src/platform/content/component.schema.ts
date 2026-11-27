import { Schema } from "effect"

export const ComponentIdSchema = Schema.Literals([
  "button",
  "field",
  "checkbox",
  "switch",
  "radio-group",
  "select",
  "slider",
  "toggle",
  "avatar",
  "code-block"
])
export type ComponentId = typeof ComponentIdSchema.Type
