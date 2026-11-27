import { Schema } from "effect"

export const TemplateIdSchema = Schema.Literals(["checkout", "dashboard", "login", "settings"])
export type TemplateId = typeof TemplateIdSchema.Type
