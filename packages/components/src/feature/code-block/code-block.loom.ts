import * as Loom from "@weft/loom/Loom"
import { HtmlLocator } from "@effect/ui/html/testing"
import { CodeBlock } from "./code-block.component.ts"
import { CodeBlockMessageSchema } from "./code-block.schema.ts"

export default Loom.make({
  title: "CodeBlock",
  args: {
    title: "select.loom.ts",
    language: "ts",
    code: `export default Loom.make({
  title: "Select",
  args: { label: "Fruit", value: null, items },
  render: (h, args) => Select(h, { ...args, onPick: ({ value }) => ({ value }) }),
  scenarios: {
    opens: [SelectMessageSchema.RequestedOpen()],
    "picks pear": [SelectMessageSchema.RequestedOpen(), SelectMessageSchema.PickedValue({ value: "pear" })]
  }
})`,
    lineNumbers: true,
    copy: true,
    wrap: false,
    collapsible: false
  },
  render: (h, args) => CodeBlock(h, args),

  scenarios: {
    copies: [CodeBlockMessageSchema.PressedCopy()],

    "copied, then cleared": [CodeBlockMessageSchema.Copied()],

    "copy fails": [CodeBlockMessageSchema.CopyFailed()],

    "copies on click": [
      (root: HTMLElement) => HtmlLocator.click(HtmlLocator.getByRole(root, "button", { name: /copy/i }))
    ],

    expands: {
      args: {
        collapsible: true,
        title: "tokens.ts",
        code: ["accent", "accentFg", "fg", "fgMuted", "surface", "surfaceMuted", "border", "ring", "danger", "dangerFg"]
          .flatMap((name, index) => [`export const ${name} = Colors.${name}`, `// ${index + 1} of 10`])
          .join("\n")
      },
      steps: [CodeBlockMessageSchema.PressedExpand()]
    }
  }
})
