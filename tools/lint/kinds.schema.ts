import { Schema } from "effect"

export const PathInput = Schema.Struct({ path: Schema.String })
export type PathInput = typeof PathInput.Type

export const RuleFileInput = Schema.Struct({ ruleFile: Schema.String })
export type RuleFileInput = typeof RuleFileInput.Type

export const GetDocPathInput = Schema.Struct({ dir: Schema.String, kind: Schema.String })
export type GetDocPathInput = typeof GetDocPathInput.Type

export const IsInScopeInput = Schema.Struct({ ruleFile: Schema.String, file: Schema.String })
export type IsInScopeInput = typeof IsInScopeInput.Type
