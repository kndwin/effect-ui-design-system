import { Route } from "@effect/ui"
import { GetStartedRoute } from "../../feature/get-started/get-started.route.ts"
import { ComponentDocsRoute } from "../../feature/component-docs/component-docs.route.ts"
import { IntroductionRoute } from "../../feature/introduction/introduction.route.ts"
import { ThemingRoute } from "../../feature/theming/theming.route.ts"
import { TemplatesRoute } from "../../feature/templates/templates.route.ts"
import { LlmsRoute } from "../../feature/llms/llms.route.ts"
import { TokensRoute } from "../../feature/tokens/tokens.route.ts"
import { DesignSystemRoute } from "../../feature/design-system/design-system.route.ts"
import { ThemeSearchSchema } from "../theme/theme.schema.ts"

export const AppRoute = Route.union({
  Introduction: IntroductionRoute,
  GetStarted: GetStartedRoute,
  Theming: ThemingRoute,
  Llms: LlmsRoute,
  Component: ComponentDocsRoute,
  Template: TemplatesRoute,
  DesignSystem: DesignSystemRoute,
  Tokens: TokensRoute,
  NotFound: Route.make("/*", { search: ThemeSearchSchema.fields })
})
export type AppRoute = typeof AppRoute.Type
