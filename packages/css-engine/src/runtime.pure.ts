export interface RecipeRuntime {
  readonly base: string
  readonly variants: Readonly<Record<string, Readonly<Record<string, string>>>>
  readonly defaults: Readonly<Record<string, string>>
  readonly compound: ReadonlyArray<{ readonly variants: Readonly<Record<string, string>>; readonly className: string }>
}

export const recipe =
  (r: RecipeRuntime) =>
  (props: Readonly<Record<string, unknown>> = {}): string => {
    const chosen: Record<string, string> = { ...r.defaults }
    for (const [name, v] of Object.entries(props)) if (v !== undefined && v !== null) chosen[name] = String(v)
    const variantClasses = Object.entries(r.variants).flatMap(([name, values]) => {
      const picked = chosen[name]
      const cls = picked === undefined ? undefined : values[picked]
      return cls ? [cls] : []
    })
    const compoundClasses = r.compound
      .filter((c) => Object.entries(c.variants).every(([name, v]) => chosen[name] === v))
      .map((c) => c.className)
    return [r.base, ...variantClasses, ...compoundClasses].join(" ")
  }
