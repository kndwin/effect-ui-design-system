import { Number, Option, String } from "effect"
import type { ExampleMeta, MapSourceToExampleMetaInput, MapSourceToRecipeInput } from "./example.schema.ts"

export const mapSourceToExampleMeta = ({ source, file }: MapSourceToExampleMetaInput): ExampleMeta => ({
  title: Option.fromNullishOr(/export const title = "([^"]+)"/.exec(source)?.[1]).pipe(
    Option.getOrElse(() => String.capitalize(file.replaceAll("-", " ")))
  ),
  order: Option.fromNullishOr(/export const order = (\d+)/.exec(source)?.[1]).pipe(
    Option.flatMap(Number.parse),
    Option.getOrElse(() => 99)
  )
})

export const mapSourceToRecipe = ({ source }: MapSourceToRecipeInput): string =>
  source
    .replaceAll(/"@weft\/components\/(?:layout\/)?([a-z-]+)"/g, '"@/components/ui/$1"')
    .replaceAll(/"(?:\.\.\/)+(?:platform\/)?token\/contract\.token\.ts"/g, '"./tokens.ts"')
    .replaceAll(/"(?:\.\.\/)+(?:platform\/)?scale\/scales\.schema\.ts"/g, '"./scales.ts"')
