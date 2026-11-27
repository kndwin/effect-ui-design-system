import { Hash } from "effect"

export const hash = (input: string): string => (Hash.string(input) >>> 0).toString(36)

const readable = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_")

export const className = (scope: string, debugId: string, key: string, debug: boolean): string => {
  const id = hash(`${scope}\u0000${debugId}\u0000${key}`)
  return debug ? `${readable(debugId)}${key ? `_${readable(key)}` : ""}__${id}` : `a${id}`
}
