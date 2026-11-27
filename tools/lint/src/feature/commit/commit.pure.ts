import { Array, Match, String } from "effect"
import type { PushInput } from "./commit.schema.ts"

const isZeroSha = (sha: string) => /^0*$/.test(sha)

export const getPushRanges = ({ input }: PushInput): ReadonlyArray<ReadonlyArray<string>> =>
  Array.flatMap(
    Array.filter(String.split(input, "\n"), (line) => line.trim() !== ""),
    (line: string): ReadonlyArray<ReadonlyArray<string>> => {
      const [, localSha = "", , remoteSha = ""] = String.split(line.trim(), " ")
      return Match.value({ deleted: isZeroSha(localSha), created: isZeroSha(remoteSha) }).pipe(
        Match.when({ deleted: true }, () => []),
        Match.when({ created: true }, () => [[localSha, "--not", "--remotes"]]),
        Match.orElse(() => [[`${remoteSha}..${localSha}`]])
      )
    }
  )
