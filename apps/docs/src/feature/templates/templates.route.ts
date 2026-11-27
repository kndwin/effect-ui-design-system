import { Route } from "@effect/ui"
import { TemplateIdSchema } from "../../platform/content/template.schema.ts"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const TemplatesRoute = Route.make("/templates/:id", {
  params: { id: TemplateIdSchema },
  search: ThemeSearchSchema.fields
})
