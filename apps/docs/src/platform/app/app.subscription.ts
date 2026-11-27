import { Router } from "@effect/ui"
import { AppDef } from "./app.define.ts"
import { AppRoute } from "./app.route.ts"
import { AppMessageSchema } from "./app.schema.ts"

export const subscriptions = AppDef.subscriptions(({ model }) => [
  Router.subscription(AppRoute, model.route, (route) => AppMessageSchema.ChangedRoute({ route }))
])
