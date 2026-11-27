import { Number, Option, String } from "effect"
import type { ExampleMeta, MapSourceToExampleMetaInput } from "./example.schema.ts"

export const mapSourceToExampleMeta = ({ source, file }: MapSourceToExampleMetaInput): ExampleMeta => ({
  title: Option.fromNullishOr(/export const title = "([^"]+)"/.exec(source)?.[1]).pipe(
    Option.getOrElse(() => String.capitalize(file.replaceAll("-", " ")))
  ),
  order: Option.fromNullishOr(/export const order = (\d+)/.exec(source)?.[1]).pipe(
    Option.flatMap(Number.parse),
    Option.getOrElse(() => 99)
  )
})
