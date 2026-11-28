import { Schema } from "effect"
import { PackageManagerSchema } from "../../platform/config/config.schema.ts"

export const GetPackageManagerInputSchema = Schema.Struct({
  configured: Schema.optionalKey(PackageManagerSchema),
  lockfiles: Schema.Array(Schema.String),
  userAgent: Schema.optionalKey(Schema.String)
})
export type GetPackageManagerInput = typeof GetPackageManagerInputSchema.Type

export const GetReleaseInputSchema = Schema.Struct({ componentsSpecifier: Schema.String })
export type GetReleaseInput = typeof GetReleaseInputSchema.Type

export const GetInstallCommandsInputSchema = Schema.Struct({
  packageManager: PackageManagerSchema,
  release: Schema.String
})
export type GetInstallCommandsInput = typeof GetInstallCommandsInputSchema.Type

export const InstallOptionsSchema = Schema.Struct({ dryRun: Schema.Boolean })
export type InstallOptions = typeof InstallOptionsSchema.Type
