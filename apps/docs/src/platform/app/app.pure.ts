import { Match, Schema } from "effect"
import { ComponentIdSchema } from "../content/component.schema.ts"
import { pages } from "../content/content.constant.ts"
import type { Page } from "../content/content.schema.ts"
import { AppRoute } from "./app.route.ts"
import type { GetPageInput, GetPageRouteInput } from "./app.schema.ts"

export const getPage = ({ route }: GetPageInput): Page | undefined =>
  pages.find(
    (page) =>
      page.id ===
      AppRoute.match(route, {
        Introduction: () => "introduction",
        Theming: () => "theming",
        Component: ({ params }) => params.id,
        Tokens: () => "tokens",
        NotFound: () => ""
      })
  )

export const getPageRoute = ({ id, route }: GetPageRouteInput): AppRoute => {
  const search = route.search
  return Match.value(id).pipe(
    Match.when("introduction", () => AppRoute.Introduction({ search })),
    Match.when("theming", () => AppRoute.Theming({ search })),
    Match.when("tokens", () => AppRoute.Tokens({ search })),
    Match.when(Schema.is(ComponentIdSchema), (componentId) =>
      AppRoute.Component({ params: { id: componentId }, search })
    ),
    Match.orElse(() => AppRoute.Introduction({ search }))
  )
}
