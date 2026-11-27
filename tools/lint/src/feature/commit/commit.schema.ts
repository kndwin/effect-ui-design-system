import { Schema } from "effect"

export const CommitTypeSchema = Schema.Literals([
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert"
])
export type CommitType = typeof CommitTypeSchema.Type

export const SubjectInputSchema = Schema.Struct({ subject: Schema.String })
export type SubjectInput = typeof SubjectInputSchema.Type

export const PushInputSchema = Schema.Struct({ input: Schema.String })
export type PushInput = typeof PushInputSchema.Type
