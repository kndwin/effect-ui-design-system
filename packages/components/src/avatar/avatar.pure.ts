import { Array, Hash, Match, String } from "effect"
import type { GetInitialsInput } from "./avatar.schema.ts"

export const getInitials = ({ name }: GetInitialsInput): string => {
  const words = Array.filter(String.split(String.trim(name), /\s+/), String.isNonEmpty)
  const letters = Match.value(words.length > 1).pipe(
    Match.when(true, () => [words[0]!, words[words.length - 1]!]),
    Match.orElse(() => words)
  )
  return letters
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2)
}

export const getByName = <A>({ name, values }: { readonly name: string; readonly values: ReadonlyArray<A> }): A =>
  values[Math.abs(Hash.string(name)) % values.length]!
