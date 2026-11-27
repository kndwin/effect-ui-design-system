import { dirname, relative, sep } from "node:path"
import { type FileKind, fileKinds, kinds } from "./kinds.constant.ts"
import { Match } from "effect"
import type { GetDocPathInput, IsInScopeInput, PathInput, RuleFileInput } from "./kinds.schema.ts"

const skipped = /(^|\/)(node_modules|vendor|dist|\.git)\//

export const getPosixPath = ({ path }: PathInput): string => path.split(sep).join("/")

export const isGoverned = ({ path }: PathInput): boolean =>
  /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//.test(getPosixPath({ path }))

export const getFileKind = ({ path }: PathInput): FileKind | undefined => {
  const file = getPosixPath({ path }).split("/").at(-1) ?? ""
  return fileKinds.find((k) =>
    Match.value<FileKind>(k).pipe(
      Match.when({ name: Match.string }, (named) => file === named.name),
      Match.orElse((suffixed) => file.endsWith(suffixed.suffix))
    )
  )
}

export const getRuleKind = ({ ruleFile }: RuleFileInput): string =>
  getPosixPath({ path: dirname(ruleFile) })
    .split("/")
    .at(-1) ?? ""

export const getRuleSuffixes = ({ ruleFile }: RuleFileInput): ReadonlyArray<string> =>
  kinds[getRuleKind({ ruleFile })] ?? []

export const getRuleScope = ({ ruleFile }: RuleFileInput): string => dirname(dirname(dirname(ruleFile)))

export const getDocPath = ({ dir, kind }: GetDocPathInput): string => `${dir}/+rule/${kind}/${kind}.md`

export const isInScope = ({ ruleFile, file }: IsInScopeInput): boolean => {
  const within = getPosixPath({ path: relative(getRuleScope({ ruleFile }), file) })
  if (within.startsWith("..") || skipped.test(`/${within}`)) return false
  return (kinds[getRuleKind({ ruleFile })] ?? []).some((suffix) => within.endsWith(suffix))
}

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const getKebabProblem = ({ path }: PathInput): string | undefined => {
  const within = getPosixPath({ path }).match(
    /(?:^|\/)(?:packages\/(?:themes\/)?[^/]+|apps\/[^/]+)\/((?:src|test)\/.*)$/
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
