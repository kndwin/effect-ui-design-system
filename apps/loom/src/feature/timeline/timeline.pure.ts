import { Array, Match, Option } from "effect"
import type {
  ClipsAtInput,
  ClipsInput,
  DurationInput,
  GetPlayheadInput,
  GetSteppedAtInput,
  Tick
} from "./timeline.schema.ts"

const minimum = 2000
const tail = 600
const tickEvery = 100
const majorEvery = 500
const overlap = 120

export const getStart = ({ clips }: ClipsInput) =>
  Option.match(Array.head(clips), { onNone: () => 0, onSome: (clip) => clip.at })

export const getEnd = ({ clips }: ClipsInput) =>
  Option.match(Array.last(clips), { onNone: () => 0, onSome: (clip) => clip.at - getStart({ clips }) })

export const getDuration = ({ clips }: ClipsInput) => Math.max(minimum, getEnd({ clips }) + tail)

export const getOffset = ({ clips, at }: ClipsAtInput) => at - getStart({ clips })

export const getPercent = ({ clips, at }: ClipsAtInput) => (at / getDuration({ clips })) * 100

export const getPlayhead = ({ clips, at }: GetPlayheadInput) =>
  Match.value(at).pipe(
    Match.when(null, () => getEnd({ clips })),
    Match.orElse((value) => value)
  )

export const getSeqAt = ({ clips, at }: ClipsAtInput) =>
  Option.match(
    Array.findLastIndex(clips, (clip) => getOffset({ clips, at: clip.at }) <= at),
    {
      onNone: () => Option.match(Array.head(clips), { onNone: () => 0, onSome: (clip) => clip.seq - 1 }),
      onSome: (index) =>
        Option.match(Array.get(clips, index + 1), {
          onNone: () => Number.MAX_SAFE_INTEGER,
          onSome: (next) => next.seq - 1
        })
    }
  )

export const getCurrentClip = ({ clips, at }: GetPlayheadInput) =>
  Array.findLast(clips, (clip) => getOffset({ clips, at: clip.at }) <= getPlayhead({ clips, at }))

export const getSteppedAt = ({ clips, at, direction }: GetSteppedAtInput) => {
  const offsets = clips.map((clip) => getOffset({ clips, at: clip.at }))
  const playhead = getPlayhead({ clips, at })
  return Match.value(direction).pipe(
    Match.when("start", () => -1),
    Match.when("end", () => getEnd({ clips })),
    Match.when("back", () =>
      Option.getOrElse(
        Array.findLast(offsets, (offset) => offset < playhead),
        () => -1
      )
    ),
    Match.when("forward", () =>
      Option.getOrElse(
        Array.findFirst(offsets, (offset) => offset > playhead),
        () => getEnd({ clips })
      )
    ),
    Match.exhaustive
  )
}

export const getClipRows = ({ clips }: ClipsInput): ReadonlyArray<number> =>
  clips.reduce<ReadonlyArray<number>>(
    (rows, clip, index) => [
      ...rows,
      Option.match(Array.get(clips, index - 1), {
        onNone: () => 0,
        onSome: (previous) =>
          Match.value(clip.at - previous.at < overlap).pipe(
            Match.when(true, () => 1 - (rows[index - 1] ?? 0)),
            Match.orElse(() => 0)
          )
      })
    ],
    []
  )

export const getTicks = ({ duration }: DurationInput): ReadonlyArray<Tick> =>
  Array.makeBy(Math.floor(duration / tickEvery) + 1, (index) => ({
    at: index * tickEvery,
    major: (index * tickEvery) % majorEvery === 0
  }))
