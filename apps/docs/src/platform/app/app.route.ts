import { Route } from "@effect/ui"
import { ComponentDocsRoute } from "../../feature/component-docs/component-docs.route.ts"
import { IntroductionRoute } from "../../feature/introduction/introduction.route.ts"
import { ThemingRoute } from "../../feature/theming/theming.route.ts"
import { TokensRoute } from "../../feature/tokens/tokens.route.ts"
import { ThemeSearchSchema } from "../theme/theme.schema.ts"

export const AppRoute = Route.union({
  Introduction: IntroductionRoute,
  Theming: ThemingRoute,
  Component: ComponentDocsRoute,
  Tokens: TokensRoute,
  NotFound: Route.make("/*", { search: ThemeSearchSchema.fields })
})
export type AppRoute = typeof AppRoute.Type
