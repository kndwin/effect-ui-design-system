import { Match } from "effect"
import type { MapCauseToMessageInput } from "./message.schema.ts"

export const mapCauseToMessage = ({ cause }: MapCauseToMessageInput): string =>
  Match.value(cause).pipe(
    Match.when(Match.instanceOf(Error), (error) => error.message),
    Match.orElse((other) => String(other))
  )
