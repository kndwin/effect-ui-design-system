import { type FileKind, fileKinds, kinds } from "./kinds.constant.ts"
import { Match } from "effect"
import { mapPathToPosixPath, mapRuleFileToRuleKind } from "./kinds.pure.map.ts"
import type { PathInput, RuleFileInput } from "./kinds.schema.ts"

export const getFileKind = ({ path }: PathInput): FileKind | undefined => {
  const file = mapPathToPosixPath({ path }).split("/").at(-1) ?? ""
  return fileKinds.find((k) =>
    Match.value<FileKind>(k).pipe(
      Match.when({ name: Match.string }, (named) => file === named.name),
      Match.orElse((suffixed) => file.endsWith(suffixed.suffix))
    )
  )
}

export const getRuleSuffixes = ({ ruleFile }: RuleFileInput): ReadonlyArray<string> =>
  kinds[mapRuleFileToRuleKind({ ruleFile })] ?? []

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const getKebabProblem = ({ path }: PathInput): string | undefined => {
  const within = mapPathToPosixPath({ path }).match(
    /(?:^|\/)(?:packages\/(?:themes\/)?[^/]+|apps\/[^/]+|tools\/[^/]+)\/((?:src|test)\/.*)$/
  )?.[1]
  if (within === undefined) return undefined
  const segments = within.split("/")
  const file = segments.at(-1) ?? ""
  const kind = getFileKind({ path: file })
  const stem = Match.value(kind).pipe(
    Match.when({ suffix: Match.string }, (suffixed) => file.slice(0, -suffixed.suffix.length)),
    Match.orElse(() => file.replace(/\.ts$/, ""))
  )
  return [...segments.slice(0, -1), ...stem.split(".")].find((s) => !kebab.test(s))
}
