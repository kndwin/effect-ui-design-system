// Shared machinery for token kinds. Authors use the per-kind modules
// (TokenColor, TokenLength, …), never this file directly.
import type { Schema } from "effect"

export type Kind = "Color" | "Length" | "Duration" | "Shadow" | "Font" | "Weight"

// ─── Refs ───────────────────────────────────────────────────────────────────
// What a style author gets: a CSS expression string, tagged with its kind, so a
// Length can't be used where a Color is expected.
declare const RefKind: unique symbol
export type Ref<K extends Kind = Kind, Expr extends string = string> = Expr & {
  readonly [RefKind]: K
}

// ─── Groups ─────────────────────────────────────────────────────────────────
export const GroupTypeId = "~acme/ds/TokenGroup" as const
export type Key = string | number

export interface Meta<P extends string = string, K extends Kind = Kind, Keys extends Key = Key, Encoded = unknown> {
  readonly prefix: P
  readonly kind: K
  readonly keys: ReadonlyArray<Keys>
  /** decodes one theme value of this kind into a CSS string */
  readonly value: Schema.Codec<string, Encoded>
}

export type Group<P extends string, K extends Kind, Keys extends Key, Encoded> =
  & { readonly [X in Keys]: Ref<K, `var(--${P}-${SafeKey<X>})`> }
  & { readonly [GroupTypeId]: Meta<P, K, Keys, Encoded> }

export type AnyGroup = { readonly [GroupTypeId]: Meta<string, Kind, any, any> }

/** The keys of a group, usable as a prop type: `Token.KeyOf<typeof Colors>` */
export type KeyOf<G> = G extends { readonly [GroupTypeId]: Meta<any, any, infer Keys, any> } ? Keys : never
/** What a theme writes for a group: one encoded value per key. */
export type Input<G> = G extends { readonly [GroupTypeId]: Meta<any, any, infer Keys, infer E> }
  ? { readonly [X in Keys]: E }
  : never

/** Builds a kind module's `make(prefix, keys)`. */
export const kind = <K extends Kind, Encoded>(kind: K, value: Schema.Codec<string, Encoded>) =>
<const P extends string, const Keys extends ReadonlyArray<Key>>(
  prefix: P,
  keys: Keys
): Group<P, K, Keys[number], Encoded> => {
  const refs: Record<string, string> = {}
  for (const key of keys) refs[key] = `var(${cssVarName(prefix, key)})`
  return Object.assign(refs, { [GroupTypeId]: { prefix, kind, keys, value } }) as any
}

// "." isn't valid in a custom property name: Spacing["1.5"] → --spacing-1_5
type SafeKey<K extends Key> = `${K}` extends `${infer A}.${infer B}` ? `${A}_${SafeKey<B>}` : `${K}`
export const cssVarName = (prefix: string, key: Key) => `--${prefix}-${String(key).replaceAll(".", "_")}`
