import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const DesignSystemRoute = Route.make("/design-system", { search: ThemeSearchSchema.fields })
