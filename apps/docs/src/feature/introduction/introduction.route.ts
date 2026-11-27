import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const IntroductionRoute = Route.make("/", { search: ThemeSearchSchema.fields })
