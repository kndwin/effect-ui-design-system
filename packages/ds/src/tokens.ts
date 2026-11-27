// 🔒 locked. Plain .ts, not .css.ts: groups hold Schemas, which vanilla-extract can't serialise.
import { Schema } from "effect"
import * as Token from "./Token.ts"

export const Colors = Token.group("color", Schema.Struct({
  surface: Token.Color, fg: Token.Color, accent: Token.Color, accentFg: Token.Color, danger: Token.Color
}))
export const Spacing = Token.group("spacing", Schema.Struct({ 2: Token.Length, 3: Token.Length, 4: Token.Length }))
export const Radius = Token.group("radius", Schema.Struct({ md: Token.Length }))
