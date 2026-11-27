import type * as Style from "@acme/design-system/Style"
import { getStyleClasses } from "@acme/design-system/StyleClasses"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { CodeBlockStyle } from "./code-block.component.style.ts"
import { CodeBlockDef } from "./code-block.define.ts"
import type { CodeBlockOptions, LineMark } from "./code-block.schema.ts"
import { update } from "./code-block.update.ts"
import { view } from "./code-block.view.ts"

export type CodeBlockProps = Style.Props<typeof CodeBlockStyle>

const CodeBlockImpl = CodeBlockDef.make({ init: () => ({ copied: false }), update, view })

export const CodeBlock = <Msg>(h: Html.H<Msg>, options: CodeBlockOptions & CodeBlockProps): Child<Msg> => {
  const classes = getStyleClasses({ style: CodeBlockStyle, props: options })
  return CodeBlockImpl(h, {
    ...Match.value(options.key === undefined).pipe(
      Match.when(true, () => ({})),
      Match.orElse(() => ({ key: options.key }))
    ),
    props: {
      code: options.code,
      title: options.title,
      language: options.language,
      lineNumbers: options.lineNumbers,
      startLine: options.startLine,
      marks: options.marks as Record<string, LineMark> | undefined,
      wrap: options.wrap,
      copy: options.copy,
      extraClass: options.class,
      classes
    }
  })
}
