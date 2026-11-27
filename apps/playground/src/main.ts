import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { Editor } from "./Editor.ts"

Layer.launch(BrowserHost.mount(Editor, {}, document.getElementById("root")!)).pipe(Effect.runFork)
