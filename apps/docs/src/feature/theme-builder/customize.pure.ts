import { mapChoicesToArgument } from "@weft/components/customize-map"
import { Match } from "effect"
import type { GetCustomThemeCommandInput } from "./theme-builder.schema.ts"

export const getCustomThemeCommand = ({ theme, choices }: GetCustomThemeCommandInput): string => {
  const argument = mapChoicesToArgument({ choices })
  return Match.value(argument).pipe(
    Match.when("", () => `pnpm weft theme ${theme} --name custom`),
    Match.orElse(() => `pnpm weft theme ${theme} --name custom --choices "${argument}"`)
  )
}
