import { Schema } from "effect"

export const ComponentIdSchema = Schema.Literals([
  "button",
  "field",
  "checkbox",
  "switch",
  "radio-group",
  "select",
  "slider",
  "toggle",
  "dialog",
  "alert-dialog",
  "drawer",
  "popover",
  "tooltip",
  "menu",
  "toast",
  "tabs",
  "accordion",
  "collapsible",
  "separator",
  "scroll-area",
  "toolbar",
  "navigation-menu",
  "avatar",
  "code-block"
])
export type ComponentId = typeof ComponentIdSchema.Type
