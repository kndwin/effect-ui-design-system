import type { Style } from "./Style.pure.ts"
import type { Contract } from "./Theme.pure.ts"
import { GroupTypeId } from "./Token.pure.ts"

export const make = <const T extends Contract>(config: {
  readonly tokens: T
  readonly styles: ReadonlyArray<Style<string, string, unknown>>
}) => {
  const seen = new Map<string, string>()
  for (const [name, g] of Object.entries(config.tokens)) {
    const prefix = g[GroupTypeId].prefix
    const other = seen.get(prefix)
    if (other !== undefined) throw new Error(`Token groups ${other} and ${name} share the prefix "${prefix}"`)
    seen.set(prefix, name)
  }
  return {
    components: config.styles.map((s) => ({ kit: s.kit, slots: Object.keys(s.slots), variants: s.variants })),
    tokens: Object.fromEntries(
      Object.entries(config.tokens).map(([n, g]) => [
        n,
        { prefix: g[GroupTypeId].prefix, kind: g[GroupTypeId].kind, keys: g[GroupTypeId].keys.map(String) }
      ])
    ) as unknown as {
      readonly [G in keyof T]: { readonly prefix: string; readonly kind: string; readonly keys: ReadonlyArray<string> }
    }
  }
}
