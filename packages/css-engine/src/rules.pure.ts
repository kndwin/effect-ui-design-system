export interface StyleRule {
  readonly [property: string]: unknown
  readonly vars?: Readonly<Record<string, string>>
  readonly selectors?: Readonly<Record<string, StyleRule>>
  readonly "@media"?: Readonly<Record<string, StyleRule>>
}

export interface Recipe {
  readonly kind: "recipe"
  readonly debugId: string
  readonly base: StyleRule
  readonly variants: Readonly<Record<string, Readonly<Record<string, StyleRule>>>>
  readonly defaultVariants: Readonly<Record<string, string>>
  readonly compoundVariants: ReadonlyArray<{
    readonly variants: Readonly<Record<string, unknown>>
    readonly style: StyleRule
  }>
}

export interface GlobalRule {
  readonly kind: "global"
  readonly selector: string
  readonly vars?: Readonly<Record<string, string>>
  readonly style?: StyleRule
}

export interface Output {
  readonly recipes?: Readonly<Record<string, Recipe>>
  readonly globals?: ReadonlyArray<GlobalRule>
  readonly runtime: Readonly<Record<string, unknown>>
  readonly recipesAt?: string
}

export type Adapter = (value: unknown, exportName: string) => Output | undefined

export const isAdapter = (u: unknown): u is Adapter => typeof u === "function"
