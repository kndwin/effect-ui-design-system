import { Match } from "effect"
import type { GetMessageInput } from "./message.schema.ts"

export const getMessage = ({ cause }: GetMessageInput): string =>
  Match.value(cause).pipe(
    Match.when(Match.instanceOf(Error), (error) => error.message),
    Match.orElse((other) => String(other))
  )
