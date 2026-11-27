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
  const variants = Object.entries(recipe.variants).map(([variant, values]) =>
    Object.entries(values).map(([v, style]) => ({ variant, value: v, cls: name(`${variant}_${v}`), style }))
  )
  const compound = recipe.compoundVariants.map((c, i) => ({
    variants: Object.fromEntries(Object.entries(c.variants).map(([k, v]) => [k, String(v)])),
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
      variants: Object.fromEntries(
        variants.map((values) => [values[0]?.variant ?? "", Object.fromEntries(values.map((v) => [v.value, v.cls]))])
      ),
      defaults: recipe.defaultVariants,
      compound: compound.map(({ variants: vs, className: cls }) => ({ variants: vs, className: cls }))
    }
  }
}
