import { Duration as EffectDuration, Schema, SchemaTransformation } from "effect"

// ─── Kinds ──────────────────────────────────────────────────────────────────
// Each kind is a Schema: Encoded = what a theme author writes, Type = a branded
// CSS string. The brand is the *kind*, and it flows into the var ref type so a
// Length ref can't be used where a Color is expected.

export const Color = Schema.String.check(
  Schema.isPattern(/^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|rgba|hsl|hsla|oklch)\(.+\))$/i, {
    message: "expected #hex, rgb(), hsl() or oklch()"
  })
).pipe(Schema.brand("Color"))

const LengthString = Schema.String.check(
  Schema.isPattern(/^-?\d*\.?\d+(px|rem)$/, { message: "expected <n>px or <n>rem" })
)
export const Length = Schema.Union([Schema.Number, LengthString]).pipe(
  Schema.decodeTo(
    Schema.String.pipe(Schema.brand("Length")),
    SchemaTransformation.transform<string, number | string>({
      decode: (v) => (typeof v === "number" ? `${v}px` : v),
      encode: (v) => v
    }) as any
  )
)

/** Effect DurationInput ("150 millis", "0.2 seconds", 150) → "150ms" */
export const Duration = Schema.Union([Schema.Number, Schema.String]).pipe(
  Schema.check(Schema.makeFilter((u) => EffectDuration.fromInput(u as any)._tag === "Some" || "expected an Effect DurationInput, e.g. \"150 millis\"")),
  Schema.decodeTo(
    Schema.String.pipe(Schema.brand("Duration")),
    SchemaTransformation.transform<string, number | string>({
      decode: (v) => `${EffectDuration.toMillis(v as EffectDuration.Input)}ms`,
      encode: (v) => v
    }) as any
  )
)

/** A full box-shadow value. Kept opaque: themes own it, components only reference it. */
export const Shadow = Schema.String.check(
  Schema.isPattern(/^(none|(inset\s+)?-?[\d.]+(px|rem)?\s.+)$/, { message: "expected a box-shadow value" })
).pipe(Schema.brand("Shadow"))

export type Kind = "Color" | "Length" | "Duration" | "Shadow"
type KindHint<T> = T extends typeof Color.Type ? "Color"
  : T extends typeof Length.Type ? "Length"
  : T extends typeof Duration.Type ? "Duration"
  : T extends typeof Shadow.Type ? "Shadow"
  : never

// ─── Refs ───────────────────────────────────────────────────────────────────
// What a style author gets: a CSS expression string, tagged with its kind.
// Group members are `var(--prefix-key)`; derived refs (alpha) are color-mix().
declare const RefKind: unique symbol
export type Ref<K extends Kind = Kind, Expr extends string = string> = Expr & {
  readonly [RefKind]: K
}

/** `bg-primary/90` → alpha(Colors.primary, 90). Still a Color ref, so still checked. */
export const alpha = <E extends string>(color: Ref<"Color", E>, percent: number): Ref<"Color", `color-mix(in oklab, ${E} ${number}%, transparent)`> =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)` as any

// ─── Groups ─────────────────────────────────────────────────────────────────
export const GroupTypeId = "~cave/ds/TokenGroup" as const

type Fields = Readonly<Record<string | number, Schema.Top>>

export type Group<P extends string, F extends Fields> =
  & { readonly [K in keyof F & (string | number)]: Ref<KindHint<F[K]["Type"]>, `var(--${P}-${SafeKey<K>})`> }
  & {
    readonly [GroupTypeId]: {
      readonly prefix: P
      readonly schema: Schema.Struct<F>
    }
  }

export type AnyGroup = { readonly [GroupTypeId]: { readonly prefix: string; readonly schema: Schema.Struct<any> } }

/** The token keys of a group, usable as a prop type: `Token.Key<typeof Colors>` */
export type Key<G> = G extends Group<any, infer F> ? keyof F & (string | number) : never
/** Encoded (author-facing) values for a group, used by Theme.make */
export type Input<G> = G extends Group<any, infer F> ? Schema.Struct<F>["Encoded"] : never

export const group = <const P extends string, F extends Fields>(
  prefix: P,
  schema: Schema.Struct<F>
): Group<P, F> => {
  const refs: Record<string, string> = {}
  for (const key of Object.keys(schema.fields)) refs[key] = `var(${cssVarName(prefix, key)})`
  return Object.assign(refs, { [GroupTypeId]: { prefix, schema } }) as any
}

// "." isn't valid in a custom property name: Spacing["1.5"] → --spacing-1_5
type SafeKey<K extends string | number> = `${K}` extends `${infer A}.${infer B}` ? `${A}_${SafeKey<B>}` : `${K}`
export const cssVarName = (prefix: string, key: string | number) => `--${prefix}-${String(key).replaceAll(".", "_")}`
