import type { Theme } from "@weft/design-system/Theme"
import { Match } from "effect"
import { themes } from "./themes.constant.ts"
import type { GetThemeInput, GetThemeVarsInput, Vars } from "./theme.schema.ts"

export const getThemeVars = ({ theme, mode }: GetThemeVarsInput): Vars => ({
  ...theme.vars.base,
  ...Match.value(mode).pipe(
    Match.when("dark", () => theme.vars.modes["dark"]),
    Match.orElse(() => undefined)
  )
})

export const getTheme = ({ name }: GetThemeInput): Theme => themes.find((theme) => theme.name === name) ?? themes[0]!
