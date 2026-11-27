export const hash = (input: string): string => {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

const readable = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_")

export const className = (scope: string, debugId: string, key: string, debug: boolean): string => {
  const id = hash(`${scope}\u0000${debugId}\u0000${key}`)
  return debug ? `${readable(debugId)}${key ? `_${readable(key)}` : ""}__${id}` : `a${id}`
}
