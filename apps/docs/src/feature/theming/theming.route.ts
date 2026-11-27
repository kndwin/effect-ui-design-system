import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const ThemingRoute = Route.make("/theming", { search: ThemeSearchSchema.fields })
