import { type Descriptor, type PartName, pseudoSelectors, type StateName } from "../kit/kit.make.ts"
import { type Breakpoint, breakpoints, type Decl, type SlotRule } from "./rule.pure.ts"
import type { Variant } from "../variant/variant.make.ts"

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
      slots: [...Object.keys(kit.parts), ...(options?.extend ?? [])],
      base: (spec.base ?? {}) as Definition["base"],
      variants: (spec.variants ?? {}) as Definition["variants"],
      compound: (spec.compound ?? []) as Definition["compound"]
    }
    return definition as unknown as Style<K["name"], PartName<K> | E, { readonly [N in keyof V]?: V[N] | undefined }>
  }

export const selectorsOf = (
  rule: SlotRule<string> | undefined,
  partStates: Readonly<Record<string, string>>
): {
  readonly decl: Readonly<Record<string, unknown>>
  readonly selectors: Readonly<Record<string, Decl>>
  readonly media: Readonly<Record<string, Decl>>
} => {
  const { states, media: byBreakpoint, ...decl } = rule ?? {}
  const media: Record<string, Decl> = {}
  for (const [name, d] of Object.entries(byBreakpoint ?? {})) media[breakpoints[name as Breakpoint]] = d as Decl
  const selectors: Record<string, Decl> = {}
  for (const [state, d] of Object.entries(states ?? {})) {
    const sel = partStates[state] ?? (pseudoSelectors as Record<string, string>)[state]
    if (sel === undefined) throw new Error(`Unknown state "${state}"`)
    selectors[`&${sel}`] = d as Decl
  }
  return { decl, selectors, media }
}

export const classes = <Slot extends string, P>(
  style: Style<any, Slot, P>,
  props: NoInfer<P>
): { readonly [S in Slot]: string } => {
  const out: Record<string, string> = {}
  const picked: Record<string, unknown> = {}
  for (const k of Object.keys(style.variants)) {
    const v = (props as any)?.[k]
    if (v !== undefined) picked[k] = v
  }
  if (isDefinition(style)) {
    throw new Error(
      `${style.kit.name}: this style wasn't compiled. Add cssEngine({ adapter: "@acme/design-system/Compile" }) from @acme/css-engine/vite to the Vite config.`
    )
  }
  for (const [slot, fn] of Object.entries(style.slots)) out[slot] = (fn as (p: unknown) => string)(picked)
  return out as { readonly [S in Slot]: string }
}
