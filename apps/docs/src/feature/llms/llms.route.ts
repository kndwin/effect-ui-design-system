import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const LlmsRoute = Route.make("/llms", { search: ThemeSearchSchema.fields })
