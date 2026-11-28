import { Command } from "@effect/ui"
import { Effect, Schema } from "effect"
import { AppMessageSchema } from "./app.schema.ts"

export const CopyPage = Command.make("weft/docs/CopyPage", { args: { text: Schema.String } }, ({ text }) =>
  Effect.tryPromise(() => navigator.clipboard.writeText(text)).pipe(
    Effect.match({
      onSuccess: () => AppMessageSchema.CopiedPage(),
      onFailure: () => AppMessageSchema.CopyPageFailed()
    })
  )
)

export const ClearCopiedPage = Command.make("weft/docs/ClearCopiedPage", { args: {}, mode: "switch" }, () =>
  Effect.sleep("2 seconds").pipe(Effect.as(AppMessageSchema.ClearedCopiedPage()))
)
