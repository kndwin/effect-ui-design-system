import { readdirSync } from "node:fs"
import { join } from "node:path"

const skip = new Set(["node_modules", "vendor", "dist", ".git", "__rule_tests__"])

export const repoRoot = join(import.meta.dirname, "..", "..")

export type RuleExt = "md" | "yml" | "lint.ts"

const walk = (dir: string): ReadonlyArray<string> =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? skip.has(entry.name)
        ? []
        : entry.name === "+rule"
          ? [join(dir, entry.name)]
          : walk(join(dir, entry.name))
      : []
  )

export const findRuleFiles = (ext: RuleExt, dir = repoRoot): ReadonlyArray<string> =>
  walk(dir).flatMap((ruleDir) =>
    readdirSync(ruleDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => {
        const file = join(ruleDir, entry.name, `${entry.name}.${ext}`)
        return readdirSync(join(ruleDir, entry.name)).includes(`${entry.name}.${ext}`) ? [file] : []
      })
  )
