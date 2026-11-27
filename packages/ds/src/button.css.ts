import * as Style from "./Style.ts"
import * as Variant from "./Variant.ts"
import { Button } from "./kit/button.ts"
import { Size, Tone } from "./scales.ts"
import { Colors, Radius, Spacing } from "./tokens.ts"

export const ButtonStyle = Style.make(Button)({
  base: {
    root: {
      borderRadius: Radius.md,
      paddingBlock: Spacing[2],
      border: "none",
      cursor: "pointer",
      states: { disabled: { opacity: 0.5, cursor: "not-allowed" }, focusVisible: { outlineColor: Colors.accent } }
    }
  },
  variants: {
    tone: Variant.make(Tone, {
      primary: { root: { background: Colors.accent, color: Colors.accentFg } },
      neutral: { root: { background: Colors.surface, color: Colors.fg } },
      danger: { root: { background: Colors.danger, color: Colors.accentFg } }
    }, { default: "neutral" }),
    size: Variant.make(Size, {
      sm: { root: { paddingInline: Spacing[3] } },
      md: { root: { paddingInline: Spacing[4] } }
    }, { default: "md" })
  }
})
