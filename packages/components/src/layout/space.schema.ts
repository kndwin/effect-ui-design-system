import { Schema } from "effect"

export const SpaceProperty = Schema.Literals(["gap", "padding"])
export type SpaceProperty = typeof SpaceProperty.Type

export const ComposeSpaceVariantsInput = Schema.Struct({ property: SpaceProperty })
export type ComposeSpaceVariantsInput = typeof ComposeSpaceVariantsInput.Type
