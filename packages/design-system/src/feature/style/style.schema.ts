import { Schema } from "effect"

export const IsStyleDefinitionInputSchema = Schema.Struct({ value: Schema.Unknown })
export type IsStyleDefinitionInput = typeof IsStyleDefinitionInputSchema.Type

export const MapSlotRuleToSelectorsInputSchema = Schema.Struct({
  rule: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  partStates: Schema.Record(Schema.String, Schema.String)
})
export type MapSlotRuleToSelectorsInput = typeof MapSlotRuleToSelectorsInputSchema.Type
