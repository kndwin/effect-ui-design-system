// The engine: turns adapter output into CSS. Runs at build time, inside the compiler.
// This (and vite.build.ts) is the only code that touches vanilla-extract.
import { globalStyle, type StyleRule as VeStyleRule } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import type { Adapter, GlobalRule, Recipe } from "./rules.pure.ts"

const writeGlobal = (rule: GlobalRule) =>
  globalStyle(rule.selector, { ...(rule.style as VeStyleRule), ...(rule.vars ? { vars: rule.vars } : {}) })

const writeRecipe = (r: Recipe) =>
  recipe(
    {
      base: r.base as VeStyleRule,
      variants: r.variants as Record<string, Record<string, VeStyleRule>>,
      defaultVariants: r.defaultVariants,
      compoundVariants: r.compoundVariants as never
    },
    r.debugId
  )

/** Compiles every export of a module through the adapter. Exports it ignores pass through. */
export const register = (mod: Readonly<Record<string, unknown>>, compile: Adapter): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(mod).map(([name, value]) => {
      const out = compile(value, name)
      if (out === undefined) return [name, value]
      for (const rule of out.globals ?? []) writeGlobal(rule)
      if (out.recipes === undefined) return [name, out.runtime]
      const classes = Object.fromEntries(Object.entries(out.recipes).map(([key, r]) => [key, writeRecipe(r)]))
      return [name, out.recipesAt ? { ...out.runtime, [out.recipesAt]: classes } : { ...out.runtime, ...classes }]
    })
  )
