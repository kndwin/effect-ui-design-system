import { ThemeBuilderDef } from "./theme-builder.define.ts"
import { update } from "./theme-builder.update.ts"
import { view } from "./theme-builder.view.ts"

export const ThemeBuilder = ThemeBuilderDef.make({ init: () => ({}), update, view })
