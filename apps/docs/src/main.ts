import "@weft/theme-shadcn"
import "@weft/theme-astryx"
import { Router } from "@effect/ui"
import { BrowserHost, BrowserRouter } from "@effect/ui/html"
import { Effect, Layer } from "effect"
import { App } from "./platform/app/app.component.ts"
import { AppRoute } from "./platform/app/app.route.ts"

BrowserHost.mount(App, Router.props(AppRoute), document.getElementById("root")!).pipe(
  Layer.provide(BrowserRouter.layer({ routes: AppRoute })),
  Layer.launch,
  Effect.runFork
)
