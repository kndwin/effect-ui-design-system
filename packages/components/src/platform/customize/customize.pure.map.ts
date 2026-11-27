import { Array, Match, Number, Option, Schema } from "effect"
import {
  type Choices,
  ChoiceKeySchema,
  type MapArgumentToChoicesInput,
  type MapChoicesToArgumentInput
} from "./customize.schema.ts"

const empty: Choices = { custom: true, accent: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

export const mapChoicesToArgument = ({ choices }: MapChoicesToArgumentInput): string =>
  [
    ...Array.getSomes(
      Array.map(ChoiceKeySchema.literals, (key) =>
        Match.value(choices[key]).pipe(
          Match.when(null, () => Option.none()),
          Match.orElse((id) => Option.some(`${key}=${id}`))
        )
      )
    ),
    ...Match.value(choices.scale).pipe(
      Match.when(100, () => []),
      Match.orElse((scale) => [`scale=${scale}`])
    )
  ].join(",")

export const mapArgumentToChoices = ({ argument }: MapArgumentToChoicesInput): Choices =>
  Array.reduce(
    Array.filter(argument.split(","), (pair) => pair.includes("=")),
    empty,
    (choices, pair) => {
      const at = pair.indexOf("=")
      const key = pair.slice(0, at).trim()
      const value = pair.slice(at + 1).trim()
      return Match.value(key).pipe(
        Match.when("scale", () => ({ ...choices, scale: Option.getOrElse(Number.parse(value), () => 100) })),
        Match.when(Schema.is(ChoiceKeySchema), (choice) => ({ ...choices, [choice]: value })),
        Match.orElse(() => choices)
      )
    }
  )
