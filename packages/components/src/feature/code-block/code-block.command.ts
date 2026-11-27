import { Command } from "@effect/ui"
import { Effect, Schema } from "effect"
import { CodeBlockMessageSchema } from "./code-block.schema.ts"

export const CopyCode = Command.make("weft/CodeBlock/Copy", { args: { text: Schema.String } }, ({ text }) =>
  Effect.tryPromise(() => navigator.clipboard.writeText(text)).pipe(
    Effect.match({
      onSuccess: () => CodeBlockMessageSchema.Copied(),
      onFailure: () => CodeBlockMessageSchema.CopyFailed()
    })
  )
)

export const ClearCopied = Command.make("weft/CodeBlock/ClearCopied", { args: {}, mode: "switch" }, () =>
  Effect.sleep("2 seconds").pipe(Effect.as(CodeBlockMessageSchema.ClearedCopied()))
)
