// The design system's adapter for @acme/css-engine: turns what Style.make and Theme.make return
// into the engine's plain rules. Pure: the engine does the writing.
//   cssEngine({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/ds/Compile" })
import type { Output, Recipe, StyleRule } from "@acme/css-engine/rules"
import { type Definition, isDefinition, selectorsOf } from "./Style.pure.ts"
import type { Theme } from "./Theme.pure.ts"

const isTheme = (u: unknown): u is Theme =>
  typeof u === "object" && u !== null && (u as { "~acme"?: unknown })["~acme"] === "Theme"

const toRule = (rule: unknown, partStates: Readonly<Record<string, string>>): StyleRule => {
  const { decl, selectors, media } = selectorsOf(rule as never, partStates)
  return {
    ...decl,
    ...(Object.keys(selectors).length > 0 ? { selectors: selectors as Record<string, StyleRule> } : {}),
    ...(Object.keys(media).length > 0 ? { "@media": media as Record<string, StyleRule> } : {})
  }
}

const styleOutput = (exportName: string, def: Definition): Output => {
  const recipes: Record<string, Recipe> = {}
  for (const slot of def.slots) {
    const states = def.kit.parts[slot]?.states ?? {}
    recipes[slot] = {
      kind: "recipe",
      debugId: `${exportName.replace(/Style$/, "")}_${slot}`,
      base: toRule(def.base[slot], states),
      variants: Object.fromEntries(
        Object.entries(def.variants).map(([name, v]) => [
          name,
          Object.fromEntries(
            v.values.map((value) => [value, toRule((v.styles as Record<string, any>)[value]?.[slot], states)])
          )
        ])
      ),
      defaultVariants: Object.fromEntries(
        Object.entries(def.variants).flatMap(([n, v]) => (v.default === undefined ? [] : [[n, String(v.default)]]))
      ),
      compoundVariants: def.compound.flatMap((c) =>
        c[slot] ? [{ variants: c.when, style: toRule(c[slot], states) }] : []
      )
    }
  }
  return {
    recipes,
    recipesAt: "slots",
    runtime: {
      kit: def.kit.name,
      variants: Object.fromEntries(
        Object.entries(def.variants).map(([n, v]) => [n, { values: v.values, default: v.default }])
      )
    }
  }
}

/** The adapter: Style definitions become recipes, themes become global rules. */
export const compile = (value: unknown, exportName: string): Output | undefined => {
  if (isDefinition(value)) return styleOutput(exportName, value)
  if (isTheme(value)) {
    return {
      runtime: value as unknown as Record<string, unknown>,
      globals: value.rules.map((r) => ({ kind: "global", ...r }))
    }
  }
  return undefined
}
