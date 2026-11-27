import { Record } from "effect"
import { mapStyleRuleToCssRules } from "../../platform/css/css.pure.map.ts"
import { getClassName } from "../../platform/hash/hash.pure.ts"
import type { CompiledRecipe, MapRecipeToCompiledRecipeInput } from "./recipe.schema.ts"

export const mapRecipeToCompiledRecipe = ({ recipe, scope, debug }: MapRecipeToCompiledRecipeInput): CompiledRecipe => {
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
      ...mapStyleRuleToCssRules({ selector: `.${base}`, style: recipe.base }),
      ...variants.flat().flatMap((v) => mapStyleRuleToCssRules({ selector: `.${v.cls}`, style: v.style })),
      ...compound.flatMap((c) => mapStyleRuleToCssRules({ selector: `.${c.className}`, style: c.style }))
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
