// A tiny TypeScript highlighter: enough for docs snippets, no dependency.
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

export const highlight = (code: string): ReadonlyArray<readonly [Kind, string]> => {
  const out: Array<readonly [Kind, string]> = []
  let last = 0
  for (const m of code.matchAll(pattern)) {
    if (m.index > last) out.push(["plain", code.slice(last, m.index)])
    const group = m.slice(1).findIndex((g) => g !== undefined)
    out.push([kinds[group]!, m[0]])
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(["plain", code.slice(last)])
  return out
}
