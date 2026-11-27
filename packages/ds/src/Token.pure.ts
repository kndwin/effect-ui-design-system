import type { Schema } from "effect"

export type Kind = "Color" | "Length" | "Duration" | "Shadow" | "Font" | "Weight"

declare const RefKind: unique symbol
export type Ref<K extends Kind = Kind, Expr extends string = string> = Expr & {
  readonly [RefKind]: K
}

export const GroupTypeId = "~acme/ds/TokenGroup" as const
export type Key = string | number

export interface Meta<P extends string = string, K extends Kind = Kind, Keys extends Key = Key, Encoded = unknown> {
  readonly prefix: P
  readonly kind: K
  readonly keys: ReadonlyArray<Keys>

  readonly value: Schema.Codec<string, Encoded>
}

export type Group<P extends string, K extends Kind, Keys extends Key, Encoded> = {
  readonly [X in Keys]: Ref<K, `var(--${P}-${SafeKey<X>})`>
} & { readonly [GroupTypeId]: Meta<P, K, Keys, Encoded> }

export type AnyGroup = { readonly [GroupTypeId]: Meta<string, Kind, any, any> }

export type KeyOf<G> = G extends { readonly [GroupTypeId]: Meta<any, any, infer Keys, any> } ? Keys : never

export type Input<G> = G extends { readonly [GroupTypeId]: Meta<any, any, infer Keys, infer E> }
  ? { readonly [X in Keys]: E }
  : never

export const kind =
  <K extends Kind, Encoded>(name: K, value: Schema.Codec<string, Encoded>) =>
  <const P extends string, const Keys extends ReadonlyArray<Key>>(
    prefix: P,
    keys: Keys
  ): Group<P, K, Keys[number], Encoded> => {
    const refs: Record<string, string> = {}
    for (const key of keys) refs[key] = `var(${cssVarName(prefix, key)})`
    return Object.assign(refs, { [GroupTypeId]: { prefix, kind: name, keys, value } }) as any
  }

type SafeKey<K extends Key> = `${K}` extends `${infer A}.${infer B}` ? `${A}_${SafeKey<B>}` : `${K}`
export const cssVarName = (prefix: string, key: Key) => `--${prefix}-${String(key).replaceAll(".", "_")}`
