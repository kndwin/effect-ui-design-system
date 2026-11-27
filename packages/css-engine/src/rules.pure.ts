// The engine's input: plain rule data. Nothing here knows about tokens, kits or Effect UI.
// An adapter (supplied by whoever uses the engine) turns a module's exports into these.

/** CSS declarations, camelCased, with nested selectors and media queries. */
export interface StyleRule {
  readonly [property: string]: unknown
  /** `{ "&:hover": {…}, "&[data-disabled]": {…} }` */
  readonly selectors?: Readonly<Record<string, StyleRule>>
  /** `{ "screen and (max-width: 860px)": {…} }` */
  readonly "@media"?: Readonly<Record<string, StyleRule>>
}

/** A class with variants: `base`, then one class per variant value, plus compound classes. */
export interface Recipe {
  readonly kind: "recipe"
  /** a readable prefix for the class names in dev builds */
  readonly debugId: string
  readonly base: StyleRule
  readonly variants: Readonly<Record<string, Readonly<Record<string, StyleRule>>>>
  readonly defaultVariants: Readonly<Record<string, string>>
  readonly compoundVariants: ReadonlyArray<{
    readonly variants: Readonly<Record<string, unknown>>
    readonly style: StyleRule
  }>
}

/** A rule on a selector the engine doesn't name, e.g. `:root { --color-accent: … }`. */
export interface GlobalRule {
  readonly kind: "global"
  readonly selector: string
  readonly vars?: Readonly<Record<string, string>>
  readonly style?: StyleRule
}

/**
 * What an adapter returns for one export:
 * - `recipes`: the export becomes `{ ...runtime, [slot]: classFn }` (a class function per recipe key)
 * - `globals`: written as-is; the export stays `runtime`
 * Return `undefined` to leave the export alone.
 */
export interface Output {
  readonly recipes?: Readonly<Record<string, Recipe>>
  readonly globals?: ReadonlyArray<GlobalRule>
  /** the export's runtime value, before recipes are added under `recipesAt` */
  readonly runtime: Readonly<Record<string, unknown>>
  /** where the compiled recipes go in the runtime value, e.g. `slots` */
  readonly recipesAt?: string
}

/** `compile(value, exportName)`: the adapter contract. */
export type Adapter = (value: unknown, exportName: string) => Output | undefined
