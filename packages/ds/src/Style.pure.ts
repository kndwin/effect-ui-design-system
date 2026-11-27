import { type Descriptor, type PartName, pseudoSelectors, type StateName } from "./Kit.pure.ts"
import { type Breakpoint, breakpoints, type Decl, type SlotRule } from "./Rule.pure.ts"
import type { Variant } from "./Variant.pure.ts"

/** Per-slot rules for a kit, with states narrowed to that part's states. */
export type SlotStyles<K, Extra extends string = never> = {
  readonly [S in PartName<K> | Extra]?: SlotRule<StateName<K, S & string>>
}

/** A compiled style: what importers of a `.component.style.ts` file get after the build. */
export interface Style<Name extends string, Slot extends string, P> {
  readonly "~props"?: P // phantom
  readonly kit: Name
  /** one class function per slot (a vanilla-extract recipe today) */
  readonly slots: { readonly [S in Slot]: (props?: Readonly<Record<string, unknown>>) => string }
  readonly variants: Readonly<Record<string, { readonly values: ReadonlyArray<string>; readonly default: unknown }>>
}

export type Props<S> = S extends Style<any, any, infer P> ? P : never

/**
 * What a `.component.style.ts` file declares. Plain data: the build (tools/vite/engine.ts)
 * turns it into class names and CSS. Until then it has no classes.
 */
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

/**
 * Curried so the kit is fixed before the spec is checked:
 *   Style.make(Button)({ base, variants, compound })
 *   Style.make(Select, { extend: ["hint"] })({ … })   // wrapper slots go in the first call
 *
 * Returns plain data. Its type is the compiled Style, which is what importers see after the build.
 */
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

/** `states: { disabled, hover }` → `selectors: { "&[data-disabled]", "&:hover" }`, for the engine. */
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

/** Runtime: one class string per slot for the given props. */
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
      `${style.kit.name}: this style wasn't compiled. Add acmeStyles() (tools/vite/acme-styles.ts) to the Vite config.`
    )
  }
  for (const [slot, fn] of Object.entries(style.slots)) out[slot] = (fn as (p: unknown) => string)(picked)
  return out as { readonly [S in Slot]: string }
}
