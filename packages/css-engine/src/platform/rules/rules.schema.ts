import { Predicate, Schema } from "effect"

export interface StyleRule {
  readonly [property: string]: unknown
  readonly vars?: Readonly<Record<string, string>>
  readonly selectors?: Readonly<Record<string, StyleRule>>
  readonly "@media"?: Readonly<Record<string, StyleRule>>
}

export const StyleRuleSchema = Schema.declare((u: unknown): u is StyleRule => Predicate.isObject(u))

export const RecipeSchema = Schema.Struct({
  kind: Schema.Literal("recipe"),
  debugId: Schema.String,
  base: StyleRuleSchema,
  variants: Schema.Record(Schema.String, Schema.Record(Schema.String, StyleRuleSchema)),
  defaultVariants: Schema.Record(Schema.String, Schema.String),
  compoundVariants: Schema.Array(
    Schema.Struct({ variants: Schema.Record(Schema.String, Schema.Unknown), style: StyleRuleSchema })
  )
})
export type Recipe = typeof RecipeSchema.Type

export const GlobalRuleSchema = Schema.Struct({
  kind: Schema.Literal("global"),
  selector: Schema.String,
  vars: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
  style: Schema.optionalKey(StyleRuleSchema)
})
export type GlobalRule = typeof GlobalRuleSchema.Type

export const OutputSchema = Schema.Struct({
  recipes: Schema.optionalKey(Schema.Record(Schema.String, RecipeSchema)),
  globals: Schema.optionalKey(Schema.Array(GlobalRuleSchema)),
  runtime: Schema.Record(Schema.String, Schema.Unknown),
  recipesAt: Schema.optionalKey(Schema.String)
})
export type Output = typeof OutputSchema.Type

export const ComposeOutputInputSchema = Schema.Struct({ value: Schema.Unknown, exportName: Schema.String })
export type ComposeOutputInput = typeof ComposeOutputInputSchema.Type

export const IsAdapterInputSchema = Schema.Struct({ value: Schema.Unknown })
export type IsAdapterInput = typeof IsAdapterInputSchema.Type
