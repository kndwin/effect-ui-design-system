import { Array, Option, Predicate, Record } from "effect"
import type { ComposeRecipeInput, RecipeProps } from "../../platform/rules/runtime.schema.ts"

export const composeRecipe =
  ({ runtime }: ComposeRecipeInput) =>
  (props: RecipeProps = {}): string => {
    const chosen: Readonly<Record<string, string>> = {
      ...runtime.defaults,
      ...Record.map(Record.filter(props, Predicate.isNotNullish), String)
    }
    const variantClasses = Array.getSomes(
      Record.collect(runtime.variants, (name, values) =>
        Option.flatMap(Record.get(chosen, name), (picked) => Record.get(values, picked))
      )
    )
    const compoundClasses = runtime.compound
      .filter((c) => Record.every(c.variants, (v, name) => chosen[name] === v))
      .map((c) => c.className)
    return [runtime.base, ...variantClasses, ...compoundClasses].join(" ")
  }
