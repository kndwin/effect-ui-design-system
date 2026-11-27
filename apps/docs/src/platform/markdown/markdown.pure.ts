import { manifest } from "@weft/components/manifest"
import { Array, Match, Record } from "effect"
import { getInstallationSection } from "../../feature/component-docs/component-docs.pure.ts"
import { getStartedNotice, getStartedSteps } from "../../feature/get-started/get-started.constant.ts"
import { introductionSections } from "../../feature/introduction/introduction.constant.ts"
import { llmsSections } from "../../feature/llms/llms.constant.ts"
import { themesIntro, themingSections } from "../../feature/theming/theming.constant.ts"
import { CodeBlockSchema, type ContentSection } from "../content/block.schema.ts"
import { sources } from "../content/content.constant.ts"
import type { Page } from "../content/content.schema.ts"
import { siteUrl } from "../content/site.constant.ts"
import { mapSourceToRecipe } from "../example/example.pure.map.ts"
import { examples } from "../example/registry.constant.ts"
import { getThemeVars } from "../theme/theme.pure.ts"
import { themes } from "../theme/themes.constant.ts"
import { mapBlockToMarkdown } from "./markdown.pure.map.ts"
import type { GetMarkdownFilesInput, GetPageMarkdownInput, MarkdownFile } from "./markdown.schema.ts"

const getSectionMarkdown = (section: ContentSection, level = "##") =>
  [`${level} ${section.heading}`, ...Array.map(section.blocks, (block) => mapBlockToMarkdown({ block }))].join("\n\n")

const getExamplesMarkdown = (page: Page) =>
  Array.map(
    Array.filter(examples, (example) => example.page === page.id),
    (example) =>
      `### ${example.title}\n\n${mapBlockToMarkdown({
        block: CodeBlockSchema.make({ code: mapSourceToRecipe({ source: example.source.trim() }), title: example.file })
      })}`
  )

const getTokensMarkdown = () => {
  const vars = getThemeVars({ theme: themes[0]!, mode: "light" })
  return Record.toEntries(manifest.tokens).map(([group, tokens]) =>
    [
      `## ${group}`,
      `Kind: ${tokens.kind}. Values are ${themes[0]!.name}'s, in light mode.`,
      "| Token | CSS variable | Value |\n| :-- | :-- | :-- |",
      ...tokens.keys.map((key) => {
        const name = `--${tokens.prefix}-${key.replaceAll(".", "_")}`
        return `| \`${group}.${key}\` | \`${name}\` | \`${vars[name] ?? ""}\` |`
      })
    ].join("\n")
  )
}

const getBodyMarkdown = (page: Page): ReadonlyArray<string> =>
  Match.value(page.id).pipe(
    Match.when("introduction", () => introductionSections.map((section) => getSectionMarkdown(section))),
    Match.when("get-started", () => [
      mapBlockToMarkdown({ block: getStartedNotice }),
      ...getStartedSteps.map((step, index) =>
        getSectionMarkdown({ heading: `${index + 1}. ${step.heading}`, blocks: step.blocks })
      )
    ]),
    Match.when("theming", () => [
      ...themingSections.map((section) => getSectionMarkdown(section)),
      [
        "## Themes",
        themesIntro,
        ...themes.map((theme) =>
          mapBlockToMarkdown({
            block: CodeBlockSchema.make({
              code: sources.themes[theme.name as keyof typeof sources.themes],
              title: `packages/themes/${theme.name}/src/${theme.name}.theme.ts`
            })
          })
        )
      ].join("\n\n")
    ]),
    Match.when("llms", () => llmsSections.map((section) => getSectionMarkdown(section))),
    Match.when("tokens", getTokensMarkdown),
    Match.orElse(() =>
      Match.value(page.section).pipe(
        Match.when("Components", () => [
          ["## Examples", ...getExamplesMarkdown(page)].join("\n\n"),
          getSectionMarkdown(getInstallationSection({ page }))
        ]),
        Match.orElse(() => [["## Examples", ...getExamplesMarkdown(page)].join("\n\n")])
      )
    )
  )

export const getPagePath = ({ page }: GetPageMarkdownInput): string =>
  Match.value(page.section).pipe(
    Match.when("Components", () => `/components/${page.id}`),
    Match.when("Templates", () => `/templates/${page.id}`),
    Match.orElse(() =>
      Match.value(page.id).pipe(
        Match.when("introduction", () => "/"),
        Match.orElse((id) => `/${id}`)
      )
    )
  )

export const getMarkdownPath = ({ page }: GetPageMarkdownInput): string =>
  Match.value(getPagePath({ page })).pipe(
    Match.when("/", () => "/index.md"),
    Match.orElse((path) => `${path}.md`)
  )

export const getPageMarkdown = ({ page }: GetPageMarkdownInput): string =>
  [`# ${page.title}`, page.lead, ...getBodyMarkdown(page)].join("\n\n") + "\n"

export const getLlmsIndex = ({ pages }: GetMarkdownFilesInput): string =>
  [
    "# Weft",
    "> A themeable design system for @effect/ui-kit, styled at build time. Components are styled against a token contract and copied into your app with weft add; a theme fills the contract in with Effect layers.",
    `The whole site in one file: ${siteUrl}/llms-full.txt`,
    ...Array.dedupe(Array.map(pages, (page) => page.section)).map((section) =>
      [
        `## ${section}`,
        ...Array.filter(pages, (page) => page.section === section).map(
          (page) => `- [${page.title}](${siteUrl}${getMarkdownPath({ page })}): ${page.lead}`
        )
      ].join("\n")
    )
  ].join("\n\n") + "\n"

export const getLlmsFull = ({ pages }: GetMarkdownFilesInput): string =>
  pages.map((page) => getPageMarkdown({ page })).join("\n---\n\n")

export const getMarkdownFiles = ({ pages }: GetMarkdownFilesInput): ReadonlyArray<MarkdownFile> => [
  { path: "/llms.txt", content: getLlmsIndex({ pages }) },
  { path: "/llms-full.txt", content: getLlmsFull({ pages }) },
  ...pages.map((page) => ({ path: getMarkdownPath({ page }), content: getPageMarkdown({ page }) }))
]
