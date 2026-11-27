import { globalStyle } from "@vanilla-extract/css"
import { Exit, Schema, SchemaIssue } from "effect"
import { type AnyGroup, cssVarName, GroupTypeId, type Input } from "./Token.ts"

/** The token contract a component library publishes: `{ Colors, Spacing, … }` */
export type Contract = Readonly<Record<string, AnyGroup>>

/** What a theme writes: every key of every group in the contract. */
export type Values<T extends Contract> = { readonly [G in keyof T]: Input<T[G]> }
/** What a mode writes: any subset, layered over the theme's base values. */
export type ModeValues<T extends Contract> = { readonly [G in keyof T]?: Partial<Input<T[G]>> }

/** Plain data (serialisable from a `.css.ts` file), e.g. for docs swatches. */
export interface Theme<Name extends string = string, Mode extends string = string> {
  readonly name: Name
  readonly modes: ReadonlyArray<Mode>
  /** CSS variable → decoded value, for the base and for each mode */
  readonly vars: { readonly base: Readonly<Record<string, string>>; readonly modes: Readonly<Record<Mode, Readonly<Record<string, string>>>> }
}

/**
 * Must be called from a `.css.ts` file. Decodes every value through its
 * kind's Schema and emits:
 *
 *   [data-theme="astryx"]                    { base vars }
 *   [data-theme="astryx"][data-mode="dark"]  { dark overrides }
 *
 * With `default: true` the base also goes on `:root` and modes on `:root[data-mode=…]`.
 * A bad value throws at build time naming the theme, mode and path.
 */
export const make = <const T extends Contract, const Name extends string, const Mode extends string = never>(
  tokens: T,
  options: {
    readonly name: Name
    readonly default?: boolean
    readonly values: Values<T>
    readonly modes?: { readonly [M in Mode]: ModeValues<T> }
  }
): Theme<Name, Mode> => {
  const { name } = options
  const scope = (mode?: string) => {
    const self = `[data-theme="${name}"]${mode ? `[data-mode="${mode}"]` : ""}`
    return options.default ? `${mode ? `:root[data-mode="${mode}"]` : ":root"}, ${self}` : self
  }

  const base = decode(tokens, options.values, false, `Theme "${name}"`)
  globalStyle(scope(), { vars: base })

  const modes: Record<string, Record<string, string>> = {}
  for (const [mode, values] of Object.entries(options.modes ?? {}) as Array<[string, ModeValues<T>]>) {
    modes[mode] = decode(tokens, values, true, `Theme "${name}" (${mode})`)
    globalStyle(scope(mode), { vars: modes[mode] })
  }
  return { name, modes: Object.keys(modes) as Array<Mode>, vars: { base, modes: modes as any } }
}

const decode = (tokens: Contract, values: unknown, partial: boolean, label: string): Record<string, string> => {
  const fields: Record<string, Schema.Top> = {}
  for (const [groupName, g] of Object.entries(tokens)) {
    const meta = g[GroupTypeId]
    const keyFields: Record<string, Schema.Top> = {}
    for (const key of meta.keys) keyFields[key] = partial ? Schema.optionalKey(meta.value) : meta.value
    fields[groupName] = partial ? Schema.optionalKey(Schema.Struct(keyFields)) : Schema.Struct(keyFields)
  }
  const exit = Schema.decodeUnknownExit(Schema.Struct(fields) as unknown as Schema.Codec<unknown>, {
    errors: "all",
    onExcessProperty: "error"
  })(values)
  if (Exit.isFailure(exit)) {
    const err: any = (exit.cause as any).reasons?.[0]?.error ?? exit.cause
    const { issues } = SchemaIssue.makeFormatterStandardSchemaV1()(err.issue)
    const lines = issues.map((i) => {
      const path = (i.path ?? []).map((p) => (typeof p === "object" ? p.key : p)) as Array<PropertyKey>
      return `  ${path.map(String).join(".")}: ${i.message} (got ${JSON.stringify(getPath(values, path))})`
    })
    throw new Error(`${label} has invalid token values:\n${lines.join("\n")}`)
  }
  const decoded = exit.value as Record<string, Record<string, string> | undefined>
  const vars: Record<string, string> = {}
  for (const [groupName, g] of Object.entries(tokens)) {
    for (const [key, value] of Object.entries(decoded[groupName] ?? {})) vars[cssVarName(g[GroupTypeId].prefix, key)] = value
  }
  return vars
}

const getPath = (v: unknown, path: ReadonlyArray<PropertyKey>): unknown =>
  path.reduce<any>((acc, k) => (acc == null ? acc : acc[k as any]), v)
