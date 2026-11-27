import type { IsCustomizedInput } from "./theme-builder.schema.ts"
export const isCustomized = ({ choices }: IsCustomizedInput): boolean => choices.custom
