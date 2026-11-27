import { execFileSync } from "node:child_process"
import { join, relative } from "node:path"
import { findRuleFiles, repoRoot } from "./discover.build.ts"
import { inScope, kinds, ruleKindOf, scopeOf } from "./kinds.pure.ts"

export interface Match {
  readonly ruleId: string
  readonly file: string
  readonly line: number
  readonly message: string
}

const binary = join(repoRoot, "node_modules", ".bin", "ast-grep")

const scanRule = (ruleFile: string, only?: ReadonlyArray<string>): ReadonlyArray<Match> => {
  const dir = scopeOf(ruleFile)
  const targets = only ? only.filter((f) => inScope(ruleFile, f)).map((f) => relative(dir, f)) : ["."]
  if (targets.length === 0) return []
  const globs = (kinds[ruleKindOf(ruleFile)] ?? []).flatMap((s) => ["--globs", `**/*${s}`])
  const run = (args: ReadonlyArray<string>): string => {
    try {
      return execFileSync(binary, args, {
        cwd: dir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        maxBuffer: 64 * 1024 * 1024
      })
    } catch (error) {
      const { stdout } = error as { stdout?: string }
      if (typeof stdout === "string") return stdout
      throw error
    }
  }
  const output = run([
    "scan",
    "--rule",
    ruleFile,
    ...globs,
    "--globs",
    "!**/node_modules/**",
    "--globs",
    "!vendor/**",
    "--json=compact",
    ...targets
  ])
  const found = JSON.parse(output || "[]") as ReadonlyArray<{
    ruleId: string
    file: string
    message: string
    range: { start: { line: number } }
  }>
  return found
    .map((m) => ({ ruleId: m.ruleId, file: join(dir, m.file), line: m.range.start.line + 1, message: m.message }))
    .filter((m) => inScope(ruleFile, m.file))
}

export const scan = (only?: ReadonlyArray<string>): ReadonlyArray<Match> =>
  findRuleFiles("yml").flatMap((ruleFile) => scanRule(ruleFile, only))

if (import.meta.main) {
  const matches = scan()
  for (const m of matches) console.log(`${relative(repoRoot, m.file)}:${m.line}: error ${m.ruleId}: ${m.message}`)
  console.log(`ast-grep: ${matches.length} problem(s) from ${findRuleFiles("yml").length} rule file(s)`)
  process.exitCode = matches.length > 0 ? 1 : 0
}
