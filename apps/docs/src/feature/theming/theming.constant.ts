import { CodeBlockSchema, type ContentSection, TextBlockSchema } from "../../platform/content/block.schema.ts"
import { sources } from "../../platform/content/content.constant.ts"

const layerExample = `Layer.succeed(Tokens.Colors, {
  surface: "oklch(1 0 0)",
  accent: "oklch(0.49 0.22 293)",
  // …every key of Colors
})`

export const themingSections: ReadonlyArray<ContentSection> = [
  {
    heading: "The contract",
    blocks: [
      TextBlockSchema.make({
        text: "Names and kinds only. Each module (TokenColor, TokenLength, …) makes one kind, so a Length can't land where a Color is expected. Every group is also an Effect Context key, which is what a theme provides."
      }),
      CodeBlockSchema.make({
        code: sources.contract,
        title: "packages/components/src/platform/token/contract.token.ts",
        lineNumbers: true,
        collapsible: true
      })
    ]
  },
  {
    heading: "Values are layers",
    blocks: [
      TextBlockSchema.make({
        text: "A theme provides a value for each group, the way an app provides services: Layer.succeed with the group as the key. Layer.succeed checks every key of the group, and Theme.make needs a layer that provides every group, so a missing token doesn't compile."
      }),
      CodeBlockSchema.make({ code: layerExample }),
      TextBlockSchema.make({
        text: 'Modes are layers too. A mode provides only the groups it changes, and only values that differ are written. Values are decoded at build time, so "purple" for a colour fails the build with the theme, mode and path.'
      })
    ]
  }
]

export const themesIntro =
  "The two shipped themes, and yours. weft theme copies a shipped one into your app; custom is what the theme panel builds."
