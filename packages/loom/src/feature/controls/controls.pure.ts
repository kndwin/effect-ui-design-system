import { Match, Option, Predicate, Record, Schema } from "effect"
import type { ComposePatchInput, Control, GetControlsInput } from "./controls.schema.ts"

const decodeArgs = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Record(Schema.String, Schema.Unknown)))

const toControl = (name: string, value: unknown): Control =>
  Match.value(value).pipe(
    Match.when(
      (text: unknown): text is string => Predicate.isString(text) && text.includes("\n"),
      (text) => ({ name, kind: "multiline" as const, value: text })
    ),
    Match.when(Predicate.isString, (text) => ({ name, kind: "text" as const, value: text })),
    Match.when(Predicate.isNull, () => ({ name, kind: "text" as const, value: "" })),
    Match.when(Predicate.isBoolean, (flag) => ({ name, kind: "boolean" as const, value: String(flag) })),
    Match.when(Predicate.isNumber, (number) => ({ name, kind: "number" as const, value: String(number) })),
    Match.orElse((other) => ({ name, kind: "json" as const, value: JSON.stringify(other) ?? "" }))
  )

export const getControls = ({ args }: GetControlsInput): ReadonlyArray<Control> =>
  Option.match(decodeArgs(args), {
    onNone: () => [],
    onSome: (record) => Record.toEntries(record).map(([name, value]) => toControl(name, value))
  })

export const composePatch = ({ name, kind, value }: ComposePatchInput) =>
  JSON.stringify({
    [name]: Match.value(kind).pipe(
      Match.when("boolean", () => value === "true"),
      Match.when("number", () => Number(value)),
      Match.when("json", () => JSON.parse(value) as unknown),
      Match.orElse(() => value)
    )
  })
