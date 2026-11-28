import type * as Theme from "@weft/design-system/Theme"
import { defaultLoomInclude, defaultThemes, defaultUi } from "./config.constant.ts"
import type { ConfigPaths } from "./config.schema.ts"

export interface Input<T extends Theme.Theme> {
  readonly paths?: Partial<ConfigPaths> | undefined
  readonly themes?: ReadonlyArray<T> | undefined
  readonly loom?: { readonly include?: ReadonlyArray<string> | undefined; readonly theme?: T | undefined } | undefined
}

export interface WeftConfig<T extends Theme.Theme = Theme.Theme> {
  readonly paths: ConfigPaths
  readonly themes: ReadonlyArray<T>
  readonly loom: { readonly include: ReadonlyArray<string>; readonly theme?: T | undefined }
}

export const make = <const T extends Theme.Theme = Theme.Theme>(input: Input<T> = {}): WeftConfig<T> => ({
  paths: { ui: input.paths?.ui ?? defaultUi, themes: input.paths?.themes ?? defaultThemes },
  themes: input.themes ?? [],
  loom: { include: input.loom?.include ?? defaultLoomInclude, theme: input.loom?.theme ?? input.themes?.[0] }
})
