import { Record } from "effect"
import { rules } from "./css.pure.ts"
import { className } from "./hash.pure.ts"
import type { Recipe } from "./rules.pure.ts"
import type { RecipeRuntime } from "./runtime.pure.ts"

export interface CompiledRecipe {
  readonly css: ReadonlyArray<string>
  readonly runtime: RecipeRuntime
}

export const compileRecipe = (recipe: Recipe, scope: string, debug: boolean): CompiledRecipe => {
  const name = (key: string) => className(scope, recipe.debugId, key, debug)
  const base = name("")
  const variants = Record.collect(recipe.variants, (variant, values) =>
    Record.collect(values, (v, style) => ({ variant, value: v, cls: name(`${variant}_${v}`), style }))
  )
  const compound = recipe.compoundVariants.map((c, i) => ({
    variants: Record.map(c.variants, String),
    className: name(`compound_${i}`),
    style: c.style
  }))
  return {
    css: [
      ...rules(`.${base}`, recipe.base),
      ...variants.flat().flatMap((v) => rules(`.${v.cls}`, v.style)),
      ...compound.flatMap((c) => rules(`.${c.className}`, c.style))
    ],
    runtime: {
      base,
      variants: Record.fromEntries(
        variants.map((values) => [values[0]?.variant ?? "", Record.fromEntries(values.map((v) => [v.value, v.cls]))])
      ),
      defaults: recipe.defaultVariants,
      compound: compound.map(({ variants: vs, className: cls }) => ({ variants: vs, className: cls }))
    }
  }
}
