import { Schema } from "effect"

export const TemplateIdSchema = Schema.Literals(["checkout", "dashboard", "inbox", "kanban", "login", "settings"])
export type TemplateId = typeof TemplateIdSchema.Type
