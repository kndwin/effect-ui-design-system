// A tiny highlighter for CodeBlock: TypeScript and shell, no dependency.
// Each token gets data-token=<kind>; colours come from the Syntax tokens.
const pattern = new RegExp(
  [
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.source, // 1 comment
    /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/.source, // 2 string
    /\b(import|from|export|const|let|default|return|type|interface|as|new|typeof|readonly|extends|true|false|null|undefined)\b/
      .source, // 3 keyword
    /\b(\d+(?:\.\d+)?)\b/.source, // 4 number
    /\b([A-Z][A-Za-z0-9]*)\b/.source, // 5 type / namespace
    /\b([a-z_$][\w$]*)(?=\s*\()/.source // 6 call
  ].join("|"),
  "g"
)
const kinds = ["comment", "string", "keyword", "number", "type", "call"] as const
export type Kind = (typeof kinds)[number] | "plain"

const shell = new RegExp(
  [
    /(#[^\n]*)/.source, // 1 comment
    /("(?:[^"\\\n]|\\.)*"|'[^'\n]*')/.source, // 2 string
    /(?:^|(?<=[;&|]\s*))\b(pnpm|npm|npx|git|cd|node|bun|yarn)\b/.source, // 3 command
    /(\s--?[\w-]+)/.source // 4 flag
  ].join("|"),
  "gm"
)
const shellKinds = ["comment", "string", "keyword", "number"] as const

export type Language = "ts" | "shell" | "plain"

export const highlight = (code: string, language: Language = "ts"): ReadonlyArray<readonly [Kind, string]> => {
  if (language === "plain") return [["plain", code]]
  const out: Array<readonly [Kind, string]> = []
  let last = 0
  const re = language === "shell" ? shell : pattern
  const names: ReadonlyArray<Kind> = language === "shell" ? shellKinds : kinds
  for (const m of code.matchAll(re)) {
    if (m[0] === "") continue
    if (m.index > last) out.push(["plain", code.slice(last, m.index)])
    const group = m.slice(1).findIndex((g) => g !== undefined)
    out.push([names[group] ?? "plain", m[0]])
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(["plain", code.slice(last)])
  return out
}
