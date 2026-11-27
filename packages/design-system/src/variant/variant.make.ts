import type { Schema, SchemaAST } from "effect"

export const VariantTypeId = "~acme/ds/Variant" as const

export interface Variant<V extends string | boolean, Slots> {
  readonly [VariantTypeId]: { readonly value: V }
  readonly kind: "enum" | "flag"
  readonly values: ReadonlyArray<string>
  readonly default: V | undefined
  readonly styles: Readonly<Record<string, Slots>>
}

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

export const flag = <Slots>(styles: NoInfer<Slots>): Variant<boolean, Slots> => ({
  [VariantTypeId]: undefined as any,
  kind: "flag",
  values: ["true", "false"],
  default: false,
  styles: { true: styles } as any
})
