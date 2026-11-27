import { Array, Data, Record } from "effect"
import type { Style } from "../../feature/style/style.make.ts"
import type { Contract } from "../../feature/theme/theme.make.ts"
import { GroupTypeId } from "../token/token.constant.ts"

export class DuplicatePrefixError extends Data.TaggedError("DuplicatePrefixError")<{
  readonly prefix: string
  readonly groups: ReadonlyArray<string>
}> {
  override get message() {
    return `Token groups ${this.groups.join(" and ")} share the prefix "${this.prefix}"`
  }
}

export const make = <const T extends Contract>(config: {
  readonly tokens: T
  readonly styles: ReadonlyArray<Style<string, string, unknown>>
}) => {
  const byPrefix = Array.groupBy(Record.keys(config.tokens), (name) => config.tokens[name]![GroupTypeId].prefix)
  for (const [prefix, groups] of Record.toEntries(byPrefix))
    if (groups.length > 1) throw new DuplicatePrefixError({ prefix, groups })
  return {
    components: Array.map(config.styles, (s) => ({ kit: s.kit, slots: Record.keys(s.slots), variants: s.variants })),
    tokens: Record.map(config.tokens, (g) => ({
      prefix: g[GroupTypeId].prefix,
      kind: g[GroupTypeId].kind,
      keys: Array.map(g[GroupTypeId].keys, String)
    })) as unknown as {
      readonly [G in keyof T]: { readonly prefix: string; readonly kind: string; readonly keys: ReadonlyArray<string> }
    }
  }
}
