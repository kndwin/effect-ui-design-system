import { Schema } from "effect"

export const TemplateIdSchema = Schema.Literals([
  "checkout",
  "dashboard",
  "file-explorer",
  "inbox",
  "kanban",
  "login",
  "settings",
  "wizard"
])
export type TemplateId = typeof TemplateIdSchema.Type
