import { Hash, Match } from "effect"

export const hash = (input: string): string => (Hash.string(input) >>> 0).toString(36)

const readable = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_")

export const className = (scope: string, debugId: string, key: string, debug: boolean): string => {
  const id = hash(`${scope}\u0000${debugId}\u0000${key}`)
  const suffix = Match.value(key).pipe(
    Match.when("", () => ""),
    Match.orElse((k) => `_${readable(k)}`)
  )
  return Match.value(debug).pipe(
    Match.when(true, () => `${readable(debugId)}${suffix}__${id}`),
    Match.orElse(() => `a${id}`)
  )
}
