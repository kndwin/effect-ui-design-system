import { CodeBlockSchema, type ContentSection, TextBlockSchema } from "../../platform/content/block.schema.ts"
import { siteUrl } from "../../platform/content/site.constant.ts"

export const llmsSections: ReadonlyArray<ContentSection> = [
  {
    heading: "Every page as Markdown",
    blocks: [
      TextBlockSchema.make({
        text: "Each page has a Copy page button that copies it as Markdown, ready to paste into a chat. The same Markdown is served next to the page: add .md to its address. The introduction is at /index.md."
      }),
      CodeBlockSchema.make({
        code: [`${siteUrl}/index.md`, `${siteUrl}/get-started.md`, `${siteUrl}/components/button.md`].join("\n"),
        language: "plain"
      }),
      TextBlockSchema.make({
        text: "A component page's Markdown has every example's source, with imports from @/components/ui as they are after weft add, and the component's style file."
      })
    ]
  },
  {
    heading: "llms.txt",
    blocks: [
      TextBlockSchema.make({
        text: "llms.txt lists every page with a one-line summary and a link to its Markdown, following llmstxt.org. llms-full.txt is every page in one file, for tools that read a single document."
      }),
      CodeBlockSchema.make({ code: [`${siteUrl}/llms.txt`, `${siteUrl}/llms-full.txt`].join("\n"), language: "plain" })
    ]
  },
  {
    heading: "Using it with an agent",
    blocks: [
      TextBlockSchema.make({
        text: "Point your coding agent at llms-full.txt before it writes Weft code, or paste a component page's Markdown when you ask it to build with that component. Then let weft add copy the components in, so the agent edits your copies."
      }),
      CodeBlockSchema.make({
        code: `Read ${siteUrl}/llms-full.txt, then build a settings page with Weft components.`,
        language: "plain"
      })
    ]
  }
]
