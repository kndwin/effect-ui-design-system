import { Predicate } from "effect"
import type { ComposeOutputInput, IsAdapterInput, Output } from "./rules.schema.ts"

export type Adapter = (input: ComposeOutputInput) => Output | undefined

export const isAdapter = ({ value }: IsAdapterInput): boolean => Predicate.isFunction(value)
