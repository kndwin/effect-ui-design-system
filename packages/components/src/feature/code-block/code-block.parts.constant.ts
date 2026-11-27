import * as Kit from "@weft/design-system/Kit"

const CodeBlockDescriptor = Kit.make({
  name: "CodeBlock",
  parts: {
    root: { states: {} },
    header: { states: {} },
    title: { states: {} },
    copy: { states: { copied: "[data-copied]", floating: "[data-floating]" } },
    content: { states: { wrap: "[data-wrap]" } },
    line: {
      states: { added: "[data-mark=added]", removed: "[data-mark=removed]", highlighted: "[data-mark=highlighted]" }
    },
    lineNumber: { states: {} },
    token: {
      states: {
        comment: "[data-token=comment]",
        string: "[data-token=string]",
        keyword: "[data-token=keyword]",
        number: "[data-token=number]",
        type: "[data-token=type]",
        call: "[data-token=call]"
      }
    }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})
export interface CodeBlockParts extends Kit.Type<typeof CodeBlockDescriptor> {}
export const CodeBlockParts: CodeBlockParts = CodeBlockDescriptor
