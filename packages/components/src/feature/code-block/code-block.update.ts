import { ClearCopied, CopyCode } from "./code-block.command.ts"
import { CodeBlockDef } from "./code-block.define.ts"

export const update = CodeBlockDef.update({
  PressedCopy: ($) => $.run(CopyCode.make({ text: $.props.code })),
  Copied: ($) => $.evolve({ copied: true }).run(ClearCopied.make({})),
  CopyFailed: ($) => $.model,
  ClearedCopied: ($) => $.evolve({ copied: false }),
  PressedExpand: ($) => $.evolve({ expanded: true })
})
