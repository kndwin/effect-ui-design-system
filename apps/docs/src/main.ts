import "@acme/theme-shadcn"
import "@acme/theme-astryx"
import "./docs.css"
import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { Docs } from "./Docs.ts"

Layer.launch(BrowserHost.mount(Docs, {}, document.getElementById("root")!)).pipe(Effect.runFork)
