import { Array, Option, Predicate, Record } from "effect"

export interface RecipeRuntime {
  readonly base: string
  readonly variants: Readonly<Record<string, Readonly<Record<string, string>>>>
  readonly defaults: Readonly<Record<string, string>>
  readonly compound: ReadonlyArray<{ readonly variants: Readonly<Record<string, string>>; readonly className: string }>
}

export const recipe =
  (r: RecipeRuntime) =>
  (props: Readonly<Record<string, unknown>> = {}): string => {
    const chosen: Readonly<Record<string, string>> = {
      ...r.defaults,
      ...Record.map(Record.filter(props, Predicate.isNotNullish), String)
    }
    const variantClasses = Array.getSomes(
      Record.collect(r.variants, (name, values) =>
        Option.flatMap(Record.get(chosen, name), (picked) => Record.get(values, picked))
      )
    )
    const compoundClasses = r.compound
      .filter((c) => Record.every(c.variants, (v, name) => chosen[name] === v))
      .map((c) => c.className)
    return [r.base, ...variantClasses, ...compoundClasses].join(" ")
  }
