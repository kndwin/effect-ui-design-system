import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { Gallery } from "./Gallery.ts"

Layer.launch(BrowserHost.mount(Gallery, {}, document.getElementById("root")!)).pipe(Effect.runFork)
