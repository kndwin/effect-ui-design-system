import { Match, Record } from "effect"
import type { IsCustomizedInput } from "./theme-builder.schema.ts"
export const isCustomized = ({ choices }: IsCustomizedInput): boolean =>
  Record.some(choices, (value, key) =>
    Match.value(key).pipe(
      Match.when("scale", () => value !== 100),
      Match.orElse(() => value !== null)
    )
  )
