import { Record } from "effect"
import { getRules } from "./css.pure.ts"
import { getClassName } from "./hash.pure.ts"
import type { CompiledRecipe, GetCompiledRecipeInput } from "./recipe.schema.ts"

export const getCompiledRecipe = ({ recipe, scope, debug }: GetCompiledRecipeInput): CompiledRecipe => {
  const getSlotClassName = (key: string) => getClassName({ scope, debugId: recipe.debugId, key, debug })
  const base = getSlotClassName("")
  const variants = Record.collect(recipe.variants, (variant, values) =>
    Record.collect(values, (v, style) => ({ variant, value: v, cls: getSlotClassName(`${variant}_${v}`), style }))
  )
  const compound = recipe.compoundVariants.map((c, i) => ({
    variants: Record.map(c.variants, String),
    className: getSlotClassName(`compound_${i}`),
    style: c.style
  }))
  return {
    css: [
      ...getRules({ selector: `.${base}`, style: recipe.base }),
      ...variants.flat().flatMap((v) => getRules({ selector: `.${v.cls}`, style: v.style })),
      ...compound.flatMap((c) => getRules({ selector: `.${c.className}`, style: c.style }))
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
