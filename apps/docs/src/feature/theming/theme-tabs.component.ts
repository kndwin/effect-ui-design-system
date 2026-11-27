import { ThemeTabsDef } from "./theme-tabs.define.ts"
import { update } from "./theme-tabs.update.ts"
import { view } from "./theme-tabs.view.ts"

export const ThemeTabs = ThemeTabsDef.make({ init: () => ({ tab: null }), update, view })
