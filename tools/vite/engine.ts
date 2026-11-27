// The build-time engine: turns the plain data exported by *.component.style.ts and *.theme.ts
// files into CSS. It is the only code that touches vanilla-extract; the plugin runs it inside
// vanilla-extract's compiler, which collects the CSS and serialises what this returns.
import { globalStyle, type StyleRule } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { type Definition, isDefinition, selectorsOf } from "../../packages/ds/src/Style.pure.ts"
import type { Theme } from "../../packages/ds/src/Theme.pure.ts"

const isTheme = (u: unknown): u is Theme => typeof u === "object" && u !== null && (u as Theme)["~acme"] === "Theme"

const toRule = (rule: unknown, partStates: Readonly<Record<string, string>>): StyleRule => {
  const { decl, selectors, media } = selectorsOf(rule as never, partStates)
  return {
    ...(decl as StyleRule),
    ...(Object.keys(selectors).length > 0 ? { selectors } : {}),
    ...(Object.keys(media).length > 0 ? { "@media": media } : {})
  } as StyleRule
}

const compileStyle = (exportName: string, def: Definition) => {
  const slots: Record<string, unknown> = {}
  for (const slot of def.slots) {
    const states = def.kit.parts[slot]?.states ?? {}
    slots[slot] = recipe(
      {
        base: toRule(def.base[slot], states),
        variants: Object.fromEntries(
          Object.entries(def.variants).map(([name, v]) => [
            name,
            Object.fromEntries(v.values.map((value) => [value, toRule((v.styles as any)[value]?.[slot], states)]))
          ])
        ),
        defaultVariants: Object.fromEntries(
          Object.entries(def.variants).flatMap(([n, v]) => (v.default === undefined ? [] : [[n, String(v.default)]]))
        ),
        compoundVariants: def.compound.flatMap((c) =>
          c[slot] ? [{ variants: c.when as never, style: toRule(c[slot], states) }] : []
        )
      },
      `${exportName.replace(/Style$/, "")}_${slot}`
    )
  }
  return {
    kit: def.kit.name,
    slots,
    variants: Object.fromEntries(
      Object.entries(def.variants).map(([n, v]) => [n, { values: v.values, default: v.default }])
    )
  }
}

/** Compiles every export of a style or theme module. Other exports pass through. */
export const register = (mod: Readonly<Record<string, unknown>>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(mod).map(([name, value]) => {
      if (isDefinition(value)) return [name, compileStyle(name, value)]
      if (isTheme(value)) {
        for (const rule of value.rules) globalStyle(rule.selector, { vars: rule.vars })
        return [name, value]
      }
      return [name, value]
    })
  )
