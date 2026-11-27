import { Schema } from "effect"
import { GlobalRuleSchema, StyleRuleSchema } from "../rules/rules.schema.ts"

export const MapPropertyNameToCssNameInputSchema = Schema.Struct({ name: Schema.String })
export type MapPropertyNameToCssNameInput = typeof MapPropertyNameToCssNameInputSchema.Type

export const MapValueToCssValueInputSchema = Schema.Struct({ name: Schema.String, value: Schema.Unknown })
export type MapValueToCssValueInput = typeof MapValueToCssValueInputSchema.Type

export const MapStyleRuleToDeclarationsInputSchema = Schema.Struct({ style: StyleRuleSchema })
export type MapStyleRuleToDeclarationsInput = typeof MapStyleRuleToDeclarationsInputSchema.Type

export const MapStyleRuleToCssRulesInputSchema = Schema.Struct({ selector: Schema.String, style: StyleRuleSchema })
export type MapStyleRuleToCssRulesInput = typeof MapStyleRuleToCssRulesInputSchema.Type

export const MapGlobalRuleToCssRulesInputSchema = Schema.Struct({ rule: GlobalRuleSchema })
export type MapGlobalRuleToCssRulesInput = typeof MapGlobalRuleToCssRulesInputSchema.Type
