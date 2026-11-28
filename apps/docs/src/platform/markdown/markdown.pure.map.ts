import { Match } from "effect"
import type { MapBlockToMarkdownInput } from "./markdown.schema.ts"

const getFence = (code: string) => "`".repeat(Math.max(3, ...[...code.matchAll(/`+/g)].map((m) => m[0].length + 1)))

export const mapBlockToMarkdown = ({ block }: MapBlockToMarkdownInput): string =>
  Match.value(block).pipe(
    Match.tag("Text", ({ text }) => text),
    Match.tag("Notice", ({ text }) => `> ${text}`),
    Match.tag("Code", ({ code, title, language }) => {
      const fence = getFence(code)
      const info = [
        Match.value(language).pipe(
          Match.when("shell", () => "bash"),
          Match.when("plain", () => "text"),
          Match.orElse(() => "ts")
        ),
        ...Match.value(title).pipe(
          Match.when(undefined, () => []),
          Match.orElse((name) => [`title="${name}"`])
        )
      ].join(" ")
      return `${fence}${info}\n${code.trimEnd()}\n${fence}`
    }),
    Match.tag("Cards", ({ cards }) => cards.map((card) => `- **${card.title}**: ${card.text}`).join("\n")),
    Match.exhaustive
  )
