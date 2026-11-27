import { Schema } from "effect"

export const ComponentIdSchema = Schema.Literals(["button", "avatar", "code-block"])
export type ComponentId = typeof ComponentIdSchema.Type
