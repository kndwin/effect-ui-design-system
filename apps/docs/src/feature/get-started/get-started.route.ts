import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const GetStartedRoute = Route.make("/get-started", { search: ThemeSearchSchema.fields })
