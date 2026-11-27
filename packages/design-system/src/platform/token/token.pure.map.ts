import type { MapTokenKeyToCssVarNameInput } from "./token.schema.ts"
export const mapTokenKeyToCssVarName = ({ prefix, key }: MapTokenKeyToCssVarNameInput): string =>
  `--${prefix}-${String(key).replaceAll(".", "_")}`
