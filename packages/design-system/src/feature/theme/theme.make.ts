import { Array, Cause, Context, Data, Effect, Exit, Layer, Match, Record, Schema, SchemaIssue } from "effect"
import { GroupTypeId } from "../../platform/token/token.constant.ts"
import type { AnyGroup, ServiceOf } from "../../platform/token/token.pure.ts"
import { mapTokenKeyToCssVarName } from "../../platform/token/token.pure.map.ts"

export type Contract = Readonly<Record<string, AnyGroup>>

export type Services<T extends Contract> = ServiceOf<T[keyof T]>

export interface Theme<Name extends string = string, Mode extends string = string> {
  readonly "~weft": "Theme"
  readonly name: Name

  readonly rules: ReadonlyArray<{ readonly selector: string; readonly vars: Readonly<Record<string, string>> }>
  readonly modes: ReadonlyArray<Mode>

  readonly vars: {
    readonly base: Readonly<Record<string, string>>
    readonly modes: Readonly<Record<Mode, Readonly<Record<string, string>>>>
  }
}

export class InvalidTokensError extends Data.TaggedError("InvalidTokensError")<{
  readonly theme: string
  readonly mode: string | undefined
  readonly issue: SchemaIssue.Issue
}> {
  override get message() {
    const label = `Theme "${this.theme}"${Match.value(this.mode).pipe(
      Match.when(undefined, () => ""),
      Match.orElse((mode) => ` (${mode})`)
    )}`
    return `${label} has invalid token values:\n${SchemaIssue.makeFormatterDefault()(this.issue)}`
  }
}

const schemaOf = (tokens: Contract, partial: boolean): Schema.Codec<unknown> => {
  const optional = (s: Schema.Top) =>
    Match.value(partial).pipe(
      Match.when(true, () => Schema.optionalKey(s)),
      Match.orElse(() => s)
    )
  const groups = Record.map(tokens, (g) =>
    optional(
      Schema.Struct(
        Record.fromEntries(Array.map(g[GroupTypeId].keys, (key) => [String(key), optional(g[GroupTypeId].value)]))
      )
    )
  )
  return Schema.Struct(groups) as unknown as Schema.Codec<unknown>
}

const decode = (tokens: Contract, values: unknown, theme: string, mode?: string): Record<string, string> => {
  const exit = Schema.decodeUnknownExit(schemaOf(tokens, mode !== undefined), {
    errors: "all",
    onExcessProperty: "error"
  })(values)
  if (Exit.isFailure(exit)) {
    const error = Cause.squash(exit.cause)
    if (Schema.isSchemaError(error)) throw new InvalidTokensError({ theme, mode, issue: error.issue })
    throw error
  }
  const decoded = exit.value as Readonly<Record<string, Readonly<Record<string, string>> | undefined>>
  return Object.assign(
    {},
    ...Record.toEntries(tokens).map(([group, g]) =>
      Record.mapKeys(decoded[group] ?? {}, (key) => mapTokenKeyToCssVarName({ prefix: g[GroupTypeId].prefix, key }))
    )
  )
}

const valuesOf = (tokens: Contract, layer: Layer.Layer<never>) => {
  const context = Effect.runSync(Effect.scoped(Layer.build(layer)))
  return Record.getSomes(Record.map(tokens, (group) => Context.getOption(context, group)))
}

const changedFrom = (base: Readonly<Record<string, string>>, vars: Readonly<Record<string, string>>) =>
  Record.filter(vars, (value, name) => base[name] !== value)

export const make = <const T extends Contract, const Name extends string, const Mode extends string = never>(
  tokens: T,
  options: {
    readonly name: Name
    readonly default?: boolean
    readonly layer: Layer.Layer<Services<T>>
    readonly modes?: { readonly [M in Mode]: Layer.Layer<never> }
  }
): Theme<Name, Mode> => {
  const { name } = options
  const scope = (mode?: string) => {
    const self = `[data-theme="${name}"]${Match.value(mode).pipe(
      Match.when(undefined, () => ""),
      Match.orElse((m) => `[data-mode="${m}"]`)
    )}`
    return Match.value(options.default).pipe(
      Match.when(
        true,
        () =>
          `${Match.value(mode).pipe(
            Match.when(undefined, () => ":root"),
            Match.orElse((m) => `:root[data-mode="${m}"]`)
          )}, ${self}`
      ),
      Match.orElse(() => self)
    )
  }
  const base = decode(tokens, valuesOf(tokens, options.layer as Layer.Layer<never>), name)
  const modes = Record.map((options.modes ?? {}) as Record<string, Layer.Layer<never>>, (layer, mode) =>
    changedFrom(base, decode(tokens, valuesOf(tokens, layer), name, mode))
  )
  return {
    "~weft": "Theme",
    name,
    rules: [
      { selector: scope(), vars: base },
      ...Record.toEntries(modes).map(([mode, vars]) => ({ selector: scope(mode), vars }))
    ],
    modes: Record.keys(modes) as Array<Mode>,
    vars: { base, modes: modes as Record<Mode, Record<string, string>> }
  }
}
