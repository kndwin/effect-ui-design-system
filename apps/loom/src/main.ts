import "@weft/theme-shadcn"
import type * as Loom from "@weft/loom/Loom"
import { BrowserHost } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { App } from "./platform/app/app.component.ts"
import { LoomRegistry } from "./platform/canvas/canvas.command.ts"

const modules = import.meta.glob<{ readonly default: Loom.Loom }>("../../../packages/components/src/**/*.loom.ts", {
  eager: true
})

const looms = Object.values(modules).map((module) => module.default)

const index = looms.map((loom) => ({ title: loom.title, scenarios: Object.keys(loom.scenarios) }))

BrowserHost.mount(App, { looms: index, theme: "shadcn" }, document.getElementById("root")!).pipe(
  Layer.provide(Layer.succeed(LoomRegistry, looms)),
  Layer.launch,
  Effect.runFork
)
