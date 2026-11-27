import { Match } from "effect"
import type { MapNameToIdentifierInput, MapThemeToRecipeSourceInput } from "./theme.schema.ts"

export const mapNameToIdentifier = ({ name }: MapNameToIdentifierInput): string =>
  name.replaceAll(/-([a-z0-9])/g, (_match, letter: string) => letter.toUpperCase())

export const mapThemeToRecipeSource = ({ source, base, name, tokensImport }: MapThemeToRecipeSourceInput): string => {
  const named = source
    .replace('"@weft/components/tokens"', `"${tokensImport}"`)
    .replace(`export const ${base} =`, `export const ${mapNameToIdentifier({ name })} =`)
  return Match.value(named.includes("default: true")).pipe(
    Match.when(true, () => named.replace(`name: "${base}",`, `name: "${name}",`)),
    Match.orElse(() => named.replace(`name: "${base}",`, `name: "${name}",\n  default: true,`))
  )
}
