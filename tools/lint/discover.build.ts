import { readdirSync } from "node:fs"
import { join } from "node:path"

const skip = new Set(["node_modules", "vendor", "dist", ".git", "__rule_tests__"])

export const repoRoot = join(import.meta.dirname, "..", "..")

export const findRuleFiles = (ext: "md" | "yml" | "ts", dir = repoRoot): ReadonlyArray<string> =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? skip.has(entry.name)
        ? []
        : findRuleFiles(ext, join(dir, entry.name))
      : entry.name.endsWith(`.rule.${ext}`)
        ? [join(dir, entry.name)]
        : []
  )
