import { Match } from "effect"
import type { GetHighlightTokensInput, HighlightToken, TokenKind } from "./code-block.schema.ts"
const pattern = new RegExp(
  [
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.source,
    /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/.source,
    /\b(import|from|export|const|let|default|return|type|interface|as|new|typeof|readonly|extends|true|false|null|undefined)\b/
      .source,
    /\b(\d+(?:\.\d+)?)\b/.source,
    /\b([A-Z][A-Za-z0-9]*)\b/.source,
    /\b([a-z_$][\w$]*)(?=\s*\()/.source
  ].join("|"),
  "g"
)
const kinds = ["comment", "string", "keyword", "number", "type", "call"] as const

const shell = new RegExp(
  [
    /(#[^\n]*)/.source,
    /("(?:[^"\\\n]|\\.)*"|'[^'\n]*')/.source,
    /(?:^|(?<=[;&|]\s*))\b(pnpm|npm|npx|git|cd|node|bun|yarn)\b/.source,
    /(\s--?[\w-]+)/.source
  ].join("|"),
  "gm"
)
const shellKinds = ["comment", "string", "keyword", "number"] as const

export const getHighlightTokens = ({
  code,
  language = "ts"
}: GetHighlightTokensInput): ReadonlyArray<HighlightToken> => {
  if (language === "plain") return [["plain", code]]
  const out: Array<HighlightToken> = []
  let last = 0
  const re = Match.value(language === "shell").pipe(
    Match.when(true, () => shell),
    Match.orElse(() => pattern)
  )
  const names: ReadonlyArray<TokenKind> = Match.value(language === "shell").pipe(
    Match.when(true, () => shellKinds),
    Match.orElse(() => kinds)
  )
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
