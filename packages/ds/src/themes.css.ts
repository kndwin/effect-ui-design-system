// 🔒 locked
import * as Theme from "./Theme.ts"
import { Colors, Radius, Spacing } from "./tokens.ts"

export const dark = Theme.make({ Colors, Spacing, Radius }, {
  Colors: { surface: "#151518", fg: "#f4f4f5", accent: "#7c5cff", accentFg: "#ffffff", danger: "#ef4444" },
  Spacing: { 2: 8, 3: 12, 4: 16 },
  Radius: { md: 8 }
}, { name: "dark", default: true })

export const light = Theme.make({ Colors }, {
  Colors: { surface: "#f4f4f5", fg: "#09090b", accent: "#6d4aff", accentFg: "#ffffff", danger: "#dc2626" }
}, { name: "light" })
