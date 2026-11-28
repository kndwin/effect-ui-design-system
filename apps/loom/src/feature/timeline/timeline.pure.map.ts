import { Match, Predicate, Record } from "effect"
import type { Label, MapMessageToLabelInput, MapTimeToLabelInput } from "./timeline.schema.ts"

const show = (value: unknown) => JSON.stringify(value) ?? "undefined"

const toRecord = (message: unknown): Readonly<Record<string, unknown>> =>
  Match.value(message).pipe(
    Match.when(Predicate.isObject, (value) => value as Readonly<Record<string, unknown>>),
    Match.orElse(() => ({ _tag: show(message) }))
  )

export const mapMessageToLabel = ({ message }: MapMessageToLabelInput): Label => {
  const { _tag, ...fields } = toRecord(message)
  const values = Record.values(fields)
  return {
    tag: Match.value(_tag).pipe(
      Match.when(Predicate.isString, (tag) => tag),
      Match.orElse(() => "args")
    ),
    payload: Match.value(values.length).pipe(
      Match.when(0, () => ""),
      Match.when(1, () => show(values[0])),
      Match.orElse(() => show(fields))
    )
  }
}

export const mapTimeToLabel = ({ at }: MapTimeToLabelInput) => {
  const seconds = Math.max(0, at) / 1000
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, "0")}`
}
