import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"
import { ComponentIdSchema } from "./component-docs.schema.ts"

export const ComponentDocsRoute = Route.make("/components/:id", {
  params: { id: ComponentIdSchema },
  search: ThemeSearchSchema.fields
})
