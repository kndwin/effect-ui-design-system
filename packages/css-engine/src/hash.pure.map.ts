import { Hash } from "effect"
import type { MapStringToHashInput } from "./hash.schema.ts"

export const mapStringToHash = ({ input }: MapStringToHashInput): string => (Hash.string(input) >>> 0).toString(36)
