import { globalStyle } from "@vanilla-extract/css"
import { Exit, Schema, SchemaIssue } from "effect"
import { type AnyGroup, cssVarName, GroupTypeId, type Input } from "./Token.ts"

export interface Theme<Name extends string = string> {
  readonly name: Name
  readonly selector: string
  /** prefixes this theme writes; used by DesignSystem.make to check coverage */
  readonly prefixes: ReadonlyArray<string>
}

/**
 * Must be called from a `.css.ts` file: it decodes `values` through each
 * group's Schema and emits one global rule of CSS variables.
 * A bad value throws at build time with the path, e.g. `["Colors"]["accent"]`.
 */
export const make = <const G extends Record<string, AnyGroup>, const Name extends string>(
  groups: G,
  values: { readonly [K in keyof G]: Input<G[K]> },
  options: { readonly name: Name; readonly default?: boolean }
): Theme<Name> => {
  const fields: Record<string, Schema.Top> = {}
  for (const [k, g] of Object.entries(groups)) fields[k] = g[GroupTypeId].schema
  const exit = Schema.decodeUnknownExit(Schema.Struct(fields) as unknown as Schema.Codec<unknown>, { errors: "all" })(values)
  if (Exit.isFailure(exit)) {
    const err: any = (exit.cause as any).reasons?.[0]?.error ?? exit.cause
    const { issues } = SchemaIssue.makeFormatterStandardSchemaV1()(err.issue)
    const lines = issues.map((i) => {
      const path = (i.path ?? []).map((p) => (typeof p === "object" ? p.key : p)) as Array<PropertyKey>
      return `  ${path.map(String).join(".")}: ${i.message} (got ${JSON.stringify(getPath(values, path))})`
    })
    throw new Error(`Theme "${options.name}" has invalid token values:\n${lines.join("\n")}`)
  }
  const decoded = exit.value as Record<string, Record<string, string>>

  const vars: Record<string, string> = {}
  for (const [k, g] of Object.entries(groups)) {
    for (const [key, value] of Object.entries(decoded[k]!)) vars[cssVarName(g[GroupTypeId].prefix, key)] = value
  }
  const selector = options.default ? ":root" : `[data-theme="${options.name}"]`
  globalStyle(selector, { vars })
  return { name: options.name, selector, prefixes: Object.values(groups).map((g) => g[GroupTypeId].prefix) }
}

const getPath = (v: unknown, path: ReadonlyArray<PropertyKey>): unknown =>
  path.reduce<any>((acc, k) => (acc == null ? acc : acc[k as any]), v)
