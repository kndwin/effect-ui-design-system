import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { TextParts } from "./text.parts.constant.ts"
import { Colors, Font, Text, Weight } from "../contract.token.ts"
import { TextSize, TextTone, TextWeight } from "../scales.schema.ts"

export const TextStyle = Style.make(TextParts)({
  base: { root: { margin: 0, minWidth: 0 } },
  variants: {
    size: Variant.make(TextSize, {
      xs: { root: { fontSize: Text.xs, lineHeight: 1.5 } },
      sm: { root: { fontSize: Text.sm, lineHeight: 1.55 } },
      md: { root: { fontSize: Text.md, lineHeight: 1.6 } },
      lg: { root: { fontSize: Text.lg, lineHeight: 1.55 } },
      xl: { root: { fontSize: Text.xl, lineHeight: 1.35 } },
      "2xl": { root: { fontSize: Text["2xl"], lineHeight: 1.2 } }
    }),
    tone: Variant.make(TextTone, {
      default: { root: { color: Colors.fg } },
      muted: { root: { color: Colors.fgMuted } },
      accent: { root: { color: Colors.accent } },
      danger: { root: { color: Colors.danger } }
    }),
    weight: Variant.make(TextWeight, {
      regular: { root: { fontWeight: Weight.regular } },
      medium: { root: { fontWeight: Weight.medium } },
      semibold: { root: { fontWeight: Weight.semibold } }
    }),
    mono: Variant.flag({ root: { fontFamily: Font.mono } }),
    truncate: Variant.flag({ root: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }),
    caps: Variant.flag({ root: { textTransform: "uppercase" } })
  }
})
