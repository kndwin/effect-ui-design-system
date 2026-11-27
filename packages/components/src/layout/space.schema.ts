import { Schema } from "effect"

export const SpacePropertySchema = Schema.Literals(["gap", "padding"])
export type SpaceProperty = typeof SpacePropertySchema.Type

export const ComposeSpaceVariantsInputSchema = Schema.Struct({ property: SpacePropertySchema })
export type ComposeSpaceVariantsInput = typeof ComposeSpaceVariantsInputSchema.Type
