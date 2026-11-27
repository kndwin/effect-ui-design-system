import { type CodeBlockOptions, renderCodeBlock } from "@acme/ds/kit/code-block"
import * as Style from "@acme/ds/Style"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { CodeBlockStyle } from "./code-block.component.style.ts"

export type CodeBlockProps = Style.Props<typeof CodeBlockStyle>

export const CodeBlock = <Msg>(h: Html.H<Msg>, options: CodeBlockOptions & CodeBlockProps): Child<Msg> =>
  renderCodeBlock(h, options, Style.classes(CodeBlockStyle, options))
