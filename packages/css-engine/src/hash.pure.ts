import { Hash, Match } from "effect"
import type { GetClassNameInput, GetHashInput } from "./hash.schema.ts"

export const getHash = ({ input }: GetHashInput): string => (Hash.string(input) >>> 0).toString(36)

const getReadable = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_")

export const getClassName = ({ scope, debugId, key, debug }: GetClassNameInput): string => {
  const id = getHash({ input: `${scope}\u0000${debugId}\u0000${key}` })
  const suffix = Match.value(key).pipe(
    Match.when("", () => ""),
    Match.orElse((k) => `_${getReadable(k)}`)
  )
  return Match.value(debug).pipe(
    Match.when(true, () => `${getReadable(debugId)}${suffix}__${id}`),
    Match.orElse(() => `a${id}`)
  )
}
