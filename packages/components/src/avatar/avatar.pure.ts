import { Array, Hash, String } from "effect"

export const initials = (name: string): string => {
  const words = Array.filter(String.split(String.trim(name), /\s+/), String.isNonEmpty)
  const letters = words.length > 1 ? [words[0]!, words[words.length - 1]!] : words
  return letters
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2)
}

export const pickByName = <A>(name: string, values: ReadonlyArray<A>): A =>
  values[Math.abs(Hash.string(name)) % values.length]!
