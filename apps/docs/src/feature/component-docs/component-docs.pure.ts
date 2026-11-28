import { Match } from "effect"
import { CodeBlockSchema, type ContentSection, TextBlockSchema } from "../../platform/content/block.schema.ts"
import { mapSourceToRecipe } from "../../platform/example/example.pure.map.ts"
import type { GetInstallationSectionInput } from "./component-docs.schema.ts"

export const getInstallationSection = ({ page }: GetInstallationSectionInput): ContentSection => ({
  heading: "Installation",
  blocks: [
    TextBlockSchema.make({
      text: "Copy it into your app. weft add brings the component, its style and parts, and everything they import, then points the imports at your copies."
    }),
    CodeBlockSchema.make({ code: `pnpm weft add ${page.id}`, language: "shell" }),
    ...Match.value(page.style).pipe(
      Match.when(undefined, () => []),
      Match.orElse((style) => [
        TextBlockSchema.make({
          text: "The component's whole look is its style file, and it only references the token contract. Once it's in your app, edit it like any other file."
        }),
        CodeBlockSchema.make({
          code: mapSourceToRecipe({ source: style }),
          title: `src/components/ui/${page.styleFile?.split("/").at(-1) ?? ""}`,
          lineNumbers: true,
          collapsible: true
        })
      ])
    )
  ]
})
