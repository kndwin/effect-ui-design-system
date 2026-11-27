import { Record } from "effect"
import { pseudoSelectors } from "../kit/kit.make.ts"
import { type Breakpoint, breakpoints, type Decl, type SlotRule } from "./rule.constant.ts"
import { UnknownStateError } from "./style.make.ts"
import type { MapSlotRuleToSelectorsInput } from "./style.schema.ts"

const getSelector = (partStates: Readonly<Record<string, string>>, state: string): string => {
  const selector = partStates[state] ?? (pseudoSelectors as Readonly<Record<string, string>>)[state]
  if (selector === undefined) throw new UnknownStateError({ state })
  return `&${selector}`
}

export const mapSlotRuleToSelectors = ({
  rule,
  partStates
}: MapSlotRuleToSelectorsInput): {
  readonly decl: Readonly<Record<string, unknown>>
  readonly selectors: Readonly<Record<string, Decl>>
  readonly media: Readonly<Record<string, Decl>>
} => {
  const { states, media, ...decl } = (rule ?? {}) as SlotRule<string>
  return {
    decl,
    selectors: Record.mapKeys((states ?? {}) as Record<string, Decl>, (state) => getSelector(partStates, state)),
    media: Record.mapKeys((media ?? {}) as Record<string, Decl>, (name) => breakpoints[name as Breakpoint])
  }
}
