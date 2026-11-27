import type { Output, Recipe, StyleRule } from "@acme/css-engine/rules"
import { Array, Predicate, Record, Result } from "effect"
import { type Definition, isDefinition, selectorsOf } from "../style/style.make.ts"
import type { Theme } from "../theme/theme.make.ts"

const isTheme = (u: unknown): u is Theme => Predicate.isObject(u) && (u as { "~acme"?: unknown })["~acme"] === "Theme"

const toRule = (rule: unknown, partStates: Readonly<Record<string, string>>): StyleRule => {
  const { decl, selectors, media } = selectorsOf(rule as never, partStates)
  return {
    ...decl,
    ...(Record.isEmptyRecord(selectors) ? {} : { selectors: selectors as Record<string, StyleRule> }),
    ...(Record.isEmptyRecord(media) ? {} : { "@media": media as Record<string, StyleRule> })
  }
}

const recipeOf = (exportName: string, def: Definition, slot: string): Recipe => {
  const states = def.kit.parts[slot]?.states ?? {}
  return {
    kind: "recipe",
    debugId: `${exportName.replace(/Style$/, "")}_${slot}`,
    base: toRule(def.base[slot], states),
    variants: Record.map(def.variants, (v) =>
      Record.fromEntries(
        Array.map(v.values, (value) => [value, toRule((v.styles as Record<string, any>)[value]?.[slot], states)])
      )
    ),
    defaultVariants: Record.filterMap(def.variants, (v) =>
      v.default === undefined ? Result.failVoid : Result.succeed(String(v.default))
    ),
    compoundVariants: Array.flatMap(def.compound, (c) =>
      c[slot] ? [{ variants: c.when, style: toRule(c[slot], states) }] : []
    )
  }
}

const styleOutput = (exportName: string, def: Definition): Output => ({
  recipes: Record.fromEntries(Array.map(def.slots, (slot) => [slot, recipeOf(exportName, def, slot)])),
  recipesAt: "slots",
  runtime: {
    kit: def.kit.name,
    variants: Record.map(def.variants, (v) => ({ values: v.values, default: v.default }))
  }
})

export const compile = (value: unknown, exportName: string): Output | undefined => {
  if (isDefinition(value)) return styleOutput(exportName, value)
  if (isTheme(value)) {
    return {
      runtime: value as unknown as Record<string, unknown>,
      globals: Array.map(value.rules, (r) => ({ kind: "global", ...r }))
    }
  }
  return undefined
}
