import type { Choices } from "./theme-builder.schema.ts"

export const scales = [90, 100, 110] as const

export const initialChoices: Choices = {
  accent: null,
  neutrals: null,
  radius: null,
  sizing: null,
  font: null,
  mono: null,
  scale: 100
}
