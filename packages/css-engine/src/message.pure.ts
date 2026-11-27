import { Match } from "effect"

export const messageOf = (cause: unknown): string =>
  Match.value(cause).pipe(
    Match.when(Match.instanceOf(Error), (error) => error.message),
    Match.orElse((other) => String(other))
  )
