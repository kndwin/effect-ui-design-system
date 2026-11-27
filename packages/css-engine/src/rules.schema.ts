import { Predicate, Schema } from "effect"

export interface StyleRule {
  readonly [property: string]: unknown
  readonly vars?: Readonly<Record<string, string>>
  readonly selectors?: Readonly<Record<string, StyleRule>>
  readonly "@media"?: Readonly<Record<string, StyleRule>>
}

export const StyleRule = Schema.declare((u: unknown): u is StyleRule => Predicate.isObject(u))

export const Recipe = Schema.Struct({
  kind: Schema.Literal("recipe"),
  debugId: Schema.String,
  base: StyleRule,
  variants: Schema.Record(Schema.String, Schema.Record(Schema.String, StyleRule)),
  defaultVariants: Schema.Record(Schema.String, Schema.String),
  compoundVariants: Schema.Array(
    Schema.Struct({ variants: Schema.Record(Schema.String, Schema.Unknown), style: StyleRule })
  )
})
export type Recipe = typeof Recipe.Type

export const GlobalRule = Schema.Struct({
  kind: Schema.Literal("global"),
  selector: Schema.String,
  vars: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
  style: Schema.optionalKey(StyleRule)
})
export type GlobalRule = typeof GlobalRule.Type

export const Output = Schema.Struct({
  recipes: Schema.optionalKey(Schema.Record(Schema.String, Recipe)),
  globals: Schema.optionalKey(Schema.Array(GlobalRule)),
  runtime: Schema.Record(Schema.String, Schema.Unknown),
  recipesAt: Schema.optionalKey(Schema.String)
})
export type Output = typeof Output.Type

export const ComposeOutputInput = Schema.Struct({ value: Schema.Unknown, exportName: Schema.String })
export type ComposeOutputInput = typeof ComposeOutputInput.Type

export const IsAdapterInput = Schema.Struct({ value: Schema.Unknown })
export type IsAdapterInput = typeof IsAdapterInput.Type
