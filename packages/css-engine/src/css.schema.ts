import { Schema } from "effect"
import { GlobalRule, StyleRule } from "./rules.schema.ts"

export const GetPropertyNameInput = Schema.Struct({ name: Schema.String })
export type GetPropertyNameInput = typeof GetPropertyNameInput.Type

export const GetPropertyValueInput = Schema.Struct({ name: Schema.String, value: Schema.Unknown })
export type GetPropertyValueInput = typeof GetPropertyValueInput.Type

export const GetDeclarationsInput = Schema.Struct({ style: StyleRule })
export type GetDeclarationsInput = typeof GetDeclarationsInput.Type

export const GetRulesInput = Schema.Struct({ selector: Schema.String, style: StyleRule })
export type GetRulesInput = typeof GetRulesInput.Type

export const GetGlobalRulesInput = Schema.Struct({ rule: GlobalRule })
export type GetGlobalRulesInput = typeof GetGlobalRulesInput.Type
