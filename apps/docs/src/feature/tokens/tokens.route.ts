import { Route } from "@effect/ui"
import { ThemeSearchSchema } from "../../platform/theme/theme.schema.ts"

export const TokensRoute = Route.make("/tokens", { search: ThemeSearchSchema.fields })
