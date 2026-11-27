import { Schema } from "effect"

export const PathInputSchema = Schema.Struct({ path: Schema.String })
export type PathInput = typeof PathInputSchema.Type

export const RuleFileInputSchema = Schema.Struct({ ruleFile: Schema.String })
export type RuleFileInput = typeof RuleFileInputSchema.Type

export const MapRuleKindToDocPathInputSchema = Schema.Struct({ dir: Schema.String, kind: Schema.String })
export type MapRuleKindToDocPathInput = typeof MapRuleKindToDocPathInputSchema.Type

export const IsInScopeInputSchema = Schema.Struct({ ruleFile: Schema.String, file: Schema.String })
export type IsInScopeInput = typeof IsInScopeInputSchema.Type
