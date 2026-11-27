import { CommitTypeSchema, type SubjectInput } from "./commit.schema.ts"

const subjectPattern = new RegExp(`^(${CommitTypeSchema.literals.join("|")})(\\([a-z0-9./-]+\\))?!?: \\S.*$`)

export const isConventionalSubject = ({ subject }: SubjectInput): boolean => subjectPattern.test(subject)
