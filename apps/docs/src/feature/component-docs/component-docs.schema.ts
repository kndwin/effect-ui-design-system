import { Schema } from "effect"
import { PageSchema } from "../../platform/content/content.schema.ts"

export const GetInstallationSectionInputSchema = Schema.Struct({ page: PageSchema })
export type GetInstallationSectionInput = typeof GetInstallationSectionInputSchema.Type
