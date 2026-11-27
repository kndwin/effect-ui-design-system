import * as Kit from "@acme/design-system/Kit"

const AvatarDescriptor = Kit.make({
  name: "Avatar",
  parts: {
    root: {
      states: { loading: "[data-status=loading]", loaded: "[data-status=loaded]", error: "[data-status=error]" }
    },
    image: { states: {} },
    fallback: { states: {} }
  },
  vars: {},
  pseudo: []
})
export interface AvatarParts extends Kit.Type<typeof AvatarDescriptor> {}
export const AvatarParts: AvatarParts = AvatarDescriptor

export const initials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.length > 1 ? [words[0]!, words[words.length - 1]!] : words
  return letters
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2)
}

export const pickByName = <A>(name: string, values: ReadonlyArray<A>): A => {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return values[Math.abs(hash) % values.length]!
}
