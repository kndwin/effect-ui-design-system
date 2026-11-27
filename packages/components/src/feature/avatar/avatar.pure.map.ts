import { Array, Match, String } from "effect"
import type { MapNameToInitialsInput } from "./avatar.schema.ts"
export const mapNameToInitials = ({ name }: MapNameToInitialsInput): string => {
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
