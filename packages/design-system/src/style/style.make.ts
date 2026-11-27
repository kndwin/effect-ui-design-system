import { Array, Data, Record } from "effect"
import { type Descriptor, type PartName, pseudoSelectors, type StateName } from "../kit/kit.make.ts"
import type { Variant } from "../variant/variant.make.ts"
import { type Breakpoint, breakpoints, type Decl, type SlotRule } from "./rule.constant.ts"

export type SlotStyles<K, Extra extends string = never> = {
  readonly [S in PartName<K> | Extra]?: SlotRule<StateName<K, S & string>>
}

export interface Style<Name extends string, Slot extends string, P> {
  readonly "~props"?: P
  readonly kit: Name

  readonly slots: { readonly [S in Slot]: (props?: Readonly<Record<string, unknown>>) => string }
  readonly variants: Readonly<Record<string, { readonly values: ReadonlyArray<string>; readonly default: unknown }>>
}

export type Props<S> = S extends Style<any, any, infer P> ? P : never

export interface Definition {
  readonly "~acme": "Style"
  readonly kit: Descriptor
  readonly slots: ReadonlyArray<string>
  readonly base: Readonly<Record<string, SlotRule<string> | undefined>>
  readonly variants: Readonly<Record<string, Variant<any, any>>>
  readonly compound: ReadonlyArray<
    { readonly when: Readonly<Record<string, unknown>> } & Readonly<Record<string, unknown>>
  >
}

export class UnknownStateError extends Data.TaggedError("UnknownStateError")<{ readonly state: string }> {
  override get message() {
    return `Unknown state "${this.state}"`
  }
}

export class UncompiledStyleError extends Data.TaggedError("UncompiledStyleError")<{ readonly kit: string }> {
  override get message() {
    return `${this.kit}: this style wasn't compiled. Add cssEngine({ adapter: "@acme/design-system/Compile" }) from @acme/css-engine/vite to the Vite config.`
  }
}

export const isDefinition = (u: unknown): u is Definition =>
  typeof u === "object" && u !== null && (u as { "~acme"?: unknown })["~acme"] === "Style"

export const make =
  <K extends Descriptor, const E extends string = never>(kit: K, options?: { readonly extend?: ReadonlyArray<E> }) =>
  <V extends Readonly<Record<string, string | boolean>> = {}>(spec: {
    readonly base?: SlotStyles<K, E>
    readonly variants?: { readonly [N in keyof V]: Variant<V[N], SlotStyles<K, E>> }
    readonly compound?: ReadonlyArray<{ readonly when: NoInfer<{ readonly [N in keyof V]?: V[N] }> } & SlotStyles<K, E>>
  }): Style<K["name"], PartName<K> | E, { readonly [N in keyof V]?: V[N] | undefined }> => {
    const definition: Definition = {
      "~acme": "Style",
      kit,
      slots: [...Record.keys(kit.parts), ...(options?.extend ?? [])],
      base: (spec.base ?? {}) as Definition["base"],
      variants: (spec.variants ?? {}) as Definition["variants"],
      compound: (spec.compound ?? []) as Definition["compound"]
    }
    return definition as unknown as Style<K["name"], PartName<K> | E, { readonly [N in keyof V]?: V[N] | undefined }>
  }

const selectorOf = (partStates: Readonly<Record<string, string>>, state: string): string => {
  const sel = partStates[state] ?? (pseudoSelectors as Readonly<Record<string, string>>)[state]
  if (sel === undefined) throw new UnknownStateError({ state })
  return `&${sel}`
}

export const selectorsOf = (
  rule: SlotRule<string> | undefined,
  partStates: Readonly<Record<string, string>>
): {
  readonly decl: Readonly<Record<string, unknown>>
  readonly selectors: Readonly<Record<string, Decl>>
  readonly media: Readonly<Record<string, Decl>>
} => {
  const { states, media, ...decl } = rule ?? {}
  return {
    decl,
    selectors: Record.mapKeys((states ?? {}) as Record<string, Decl>, (state) => selectorOf(partStates, state)),
    media: Record.mapKeys((media ?? {}) as Record<string, Decl>, (name) => breakpoints[name as Breakpoint])
  }
}

export const classes = <Slot extends string, P>(
  style: Style<any, Slot, P>,
  props: NoInfer<P>
): { readonly [S in Slot]: string } => {
  if (isDefinition(style)) throw new UncompiledStyleError({ kit: style.kit.name })
  const picked = Record.filter(
    Record.fromEntries(Array.map(Record.keys(style.variants), (k) => [k, (props as any)?.[k]] as const)),
    (v) => v !== undefined
  )
  return Record.map(style.slots as Record<Slot, (p: unknown) => string>, (fn) => fn(picked)) as {
    readonly [S in Slot]: string
  }
}
