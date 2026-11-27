import { Predicate } from "effect"
import type { IsStyleDefinitionInput } from "./style.schema.ts"

export const isStyleDefinition = ({ value }: IsStyleDefinitionInput): boolean =>
  Predicate.isObject(value) && (value as { "~weft"?: unknown })["~weft"] === "Style"
