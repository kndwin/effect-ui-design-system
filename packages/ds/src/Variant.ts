import type { Schema, SchemaAST } from "effect"

export const VariantTypeId = "~cave/ds/Variant" as const

/** `Slots` is the per-value slot map type (SlotStyles of the kit). */
export interface Variant<V extends string | boolean, Slots> {
  readonly [VariantTypeId]: { readonly value: V }
  readonly kind: "enum" | "flag"
  readonly values: ReadonlyArray<string>
  readonly default: V | undefined
  readonly styles: Readonly<Record<string, Slots>>
}

/**
 * One style block per value, per slot. Every value of the Schema is required.
 * `Slots` is NOT inferred from the argument: it comes from where the variant
 * is used (inside `Style.make(kit)({ variants })`), so slot names, state
 * names and token kinds are all checked right at the offending property.
 */
export const make = <const L extends ReadonlyArray<SchemaAST.LiteralValue & string>, Slots>(
  schema: Schema.Literals<L>,
  styles: { readonly [K in L[number]]: NoInfer<Slots> },
  options?: { readonly default?: NoInfer<L[number]> }
): Variant<L[number], Slots> => ({
  [VariantTypeId]: undefined as any,
  kind: "enum",
  values: schema.literals as ReadonlyArray<string>,
  default: options?.default,
  styles: styles as any
})

/** Boolean variant, styled when `true`. Defaults to false. */
export const flag = <Slots>(styles: NoInfer<Slots>): Variant<boolean, Slots> => ({
  [VariantTypeId]: undefined as any,
  kind: "flag",
  values: ["true", "false"],
  default: false,
  styles: { true: styles } as any
})
