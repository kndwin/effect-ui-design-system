import { Match } from "effect"
import type { GetClassNameInput } from "./hash.schema.ts"
import { mapStringToHash } from "./hash.pure.map.ts"

const getReadable = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_")

export const getClassName = ({ scope, debugId, key, debug }: GetClassNameInput): string => {
  const id = mapStringToHash({ input: `${scope}\u0000${debugId}\u0000${key}` })
  const suffix = Match.value(key).pipe(
    Match.when("", () => ""),
    Match.orElse((k) => `_${getReadable(k)}`)
  )
  return Match.value(debug).pipe(
    Match.when(true, () => `${getReadable(debugId)}${suffix}__${id}`),
    Match.orElse(() => `a${id}`)
  )
}
