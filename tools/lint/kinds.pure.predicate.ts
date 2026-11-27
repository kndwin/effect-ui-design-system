import { relative } from "node:path"
import { kinds, skipped } from "./kinds.constant.ts"
import { mapPathToPosixPath, mapRuleFileToRuleKind, mapRuleFileToScope } from "./kinds.pure.map.ts"
import type { IsInScopeInput, PathInput } from "./kinds.schema.ts"
export const isGoverned = ({ path }: PathInput): boolean =>
  /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//.test(mapPathToPosixPath({ path }))

export const isInScope = ({ ruleFile, file }: IsInScopeInput): boolean => {
  const within = mapPathToPosixPath({ path: relative(mapRuleFileToScope({ ruleFile }), file) })
  if (within.startsWith("..") || skipped.test(`/${within}`)) return false
  return (kinds[mapRuleFileToRuleKind({ ruleFile })] ?? []).some((suffix) => within.endsWith(suffix))
}
