import { Record } from "effect"
import type { MapVarsToInlineStyleInput } from "./theme-builder.schema.ts"
export const mapVarsToInlineStyle = ({ vars }: MapVarsToInlineStyleInput): string =>
  Record.toEntries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(";")
