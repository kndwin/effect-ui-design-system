import { dirname, relative, sep } from "node:path"
import { type FileKind, fileKinds, kinds } from "./kinds.constant.ts"
import { Match } from "effect"

const skipped = /(^|\/)(node_modules|vendor|dist|\.git)\//

export const posix = (path: string) => path.split(sep).join("/")

export const isGoverned = (path: string): boolean =>
  /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//.test(posix(path))

export const kindOf = (path: string): FileKind | undefined => {
  const file = posix(path).split("/").at(-1) ?? ""
  return fileKinds.find((k) =>
    Match.value<FileKind>(k).pipe(
      Match.when({ name: Match.string }, (named) => file === named.name),
      Match.orElse((suffixed) => file.endsWith(suffixed.suffix))
    )
  )
}

export const ruleKindOf = (ruleFile: string): string => posix(dirname(ruleFile)).split("/").at(-1) ?? ""

export const scopeOf = (ruleFile: string): string => dirname(dirname(dirname(ruleFile)))

export const docPath = (dir: string, kind: string): string => `${dir}/+rule/${kind}/${kind}.md`

export const inScope = (ruleFile: string, file: string): boolean => {
  const within = posix(relative(scopeOf(ruleFile), file))
  if (within.startsWith("..") || skipped.test(`/${within}`)) return false
  return (kinds[ruleKindOf(ruleFile)] ?? []).some((suffix) => within.endsWith(suffix))
}

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const kebabProblem = (path: string): string | undefined => {
  const within = posix(path).match(/(?:^|\/)(?:packages\/(?:themes\/)?[^/]+|apps\/[^/]+)\/((?:src|test)\/.*)$/)?.[1]
  if (within === undefined) return undefined
  const segments = within.split("/")
  const file = segments.at(-1) ?? ""
  const kind = kindOf(file)
  const stem = Match.value(kind).pipe(
    Match.when({ suffix: Match.string }, (suffixed) => file.slice(0, -suffixed.suffix.length)),
    Match.orElse(() => file.replace(/\.ts$/, ""))
  )
  return [...segments.slice(0, -1), ...stem.split(".")].find((s) => !kebab.test(s))
}
