import type { StyleRule } from "@vanilla-extract/css"
import { recipe, type RuntimeFn } from "@vanilla-extract/recipes"
import { type Descriptor, type PartName, pseudoSelectors, type StateName } from "./Kit.ts"
import type { Decl, SlotRule } from "./Rule.ts"
import type { Variant } from "./Variant.ts"

/** Per-slot rules for a kit, with states narrowed to that part's states. */
export type SlotStyles<K, Extra extends string = never> = {
  readonly [S in PartName<K> | Extra]?: SlotRule<StateName<K, S & string>>
}

/** What a `.css.ts` file exports: recipe functions + plain data only (serialisable). */
export interface Style<Name extends string, Slot extends string, P> {
  readonly "~props"?: P // phantom
  readonly kit: Name
  readonly slots: { readonly [S in Slot]: RuntimeFn<any> }
  readonly variants: Readonly<Record<string, { readonly values: ReadonlyArray<string>; readonly default: unknown }>>
}

export type Props<S> = S extends Style<any, any, infer P> ? P : never

/**
 * Curried so the kit is fixed before the spec is checked:
 *   Style.make(Button)({ base, variants, compound })
 *   Style.make(Select, { extend: ["hint"] })({ … })   // wrapper slots go in the first call
 */
export const make =
  <K extends Descriptor, const E extends string = never>(kit: K, options?: { readonly extend?: ReadonlyArray<E> }) =>
  <V extends Readonly<Record<string, string | boolean>> = {}>(spec: {
    readonly base?: SlotStyles<K, E>
    readonly variants?: { readonly [N in keyof V]: Variant<V[N], SlotStyles<K, E>> }
    readonly compound?: ReadonlyArray<{ readonly when: NoInfer<{ readonly [N in keyof V]?: V[N] }> } & SlotStyles<K, E>>
  }): Style<K["name"], PartName<K> | E, { readonly [N in keyof V]?: V[N] | undefined }> => {
    const slotNames = [...Object.keys(kit.parts), ...(options?.extend ?? [])]
    const variants = (spec.variants ?? {}) as Record<string, Variant<any, any>>
    const slots: Record<string, RuntimeFn<any>> = {}

    for (const slot of slotNames) {
      const part = kit.parts[slot]
      const toVE = (rule: SlotRule<string> | undefined): StyleRule => compile(rule, part?.states ?? {})
      slots[slot] = (recipe as any)({
        base: toVE((spec.base as any)?.[slot]),
        variants: Object.fromEntries(
          Object.entries(variants).map(([name, v]) => [
            name,
            Object.fromEntries(v.values.map((value) => [value, toVE((v.styles as any)[value]?.[slot])]))
          ])
        ),
        defaultVariants: Object.fromEntries(
          Object.entries(variants).flatMap(([n, v]) => (v.default === undefined ? [] : [[n, String(v.default)]]))
        ),
        compoundVariants: (spec.compound ?? []).flatMap((c: any) =>
          c[slot] ? [{ variants: c.when, style: toVE(c[slot]) }] : []
        )
      })
    }

    return {
      kit: kit.name,
      slots: slots as any,
      variants: Object.fromEntries(
        Object.entries(variants).map(([n, v]) => [n, { values: v.values, default: v.default }])
      )
    }
  }

// states: { disabled: {...}, hover: {...} }  →  selectors: { "&[data-disabled]": {...}, "&:hover": {...} }
const compile = (rule: SlotRule<string> | undefined, partStates: Readonly<Record<string, string>>): StyleRule => {
  if (!rule) return {}
  const { states, ...decl } = rule
  const selectors: Record<string, Decl> = {}
  for (const [state, d] of Object.entries(states ?? {})) {
    const sel = partStates[state] ?? (pseudoSelectors as Record<string, string>)[state]
    if (sel === undefined) throw new Error(`Unknown state "${state}"`)
    selectors[`&${sel}`] = d as Decl
  }
  return { ...(decl as StyleRule), ...(Object.keys(selectors).length ? { selectors } : {}) } as StyleRule
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
  for (const [slot, fn] of Object.entries(style.slots)) out[slot] = (fn as any)(picked)
  return out as any
}
