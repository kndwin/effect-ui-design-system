import { ThemeDataSchema } from "@weft/design-system/ThemeSchema"
import { Effect, Schema } from "effect"

export const ModeSchema = Schema.Literals(["light", "dark"])
export type Mode = typeof ModeSchema.Type

export const ThemeSearchSchema = Schema.Struct({
  theme: Schema.String.pipe(Schema.withDecodingDefaultKey(Effect.succeed("shadcn"))),
  mode: ModeSchema.pipe(Schema.withDecodingDefaultKey(Effect.succeed("light" as const)))
})
export type ThemeSearch = typeof ThemeSearchSchema.Type

export const VarsSchema = Schema.Record(Schema.String, Schema.String)
export type Vars = typeof VarsSchema.Type

export const GetThemeVarsInputSchema = Schema.Struct({ theme: ThemeDataSchema, mode: ModeSchema })
export type GetThemeVarsInput = typeof GetThemeVarsInputSchema.Type

export const GetThemeInputSchema = Schema.Struct({ name: Schema.String })
export type GetThemeInput = typeof GetThemeInputSchema.Type

export const LookSchema = Schema.Struct({
  theme: Schema.String,
  mode: ModeSchema,
  style: Schema.optional(Schema.String)
})
export type Look = typeof LookSchema.Type
