import { dirname, sep } from "node:path"
import type { MapRuleKindToDocPathInput, PathInput, RuleFileInput } from "./kinds.schema.ts"
export const mapPathToPosixPath = ({ path }: PathInput): string => path.split(sep).join("/")

export const mapRuleFileToRuleKind = ({ ruleFile }: RuleFileInput): string =>
  mapPathToPosixPath({ path: dirname(ruleFile) })
    .split("/")
    .at(-1) ?? ""

export const mapRuleFileToScope = ({ ruleFile }: RuleFileInput): string => dirname(dirname(dirname(ruleFile)))

export const mapRuleKindToDocPath = ({ dir, kind }: MapRuleKindToDocPathInput): string =>
  `${dir}/+rule/${kind}/${kind}.md`
