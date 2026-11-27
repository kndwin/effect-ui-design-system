import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"
import { PreviewCardParts } from "./preview-card.parts.constant.ts"

export const PreviewCardStyle = Style.make(PreviewCardParts)({
  base: {
    trigger: {
      color: Colors.accent,
      fontWeight: Weight.medium,
      textDecorationLine: "underline",
      states: {
        hover: { color: Colors.fg },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring }
      }
    },
    positioner: { background: TokenColor.makeAlpha(Colors.surface, 0) },
    popup: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: Size.popup,
      maxWidth: "100%",
      padding: Spacing[4],
      fontFamily: Font.body,
      fontSize: Text.sm,
      lineHeight: 1.5,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      boxShadow: Shadow.overlay,
      outlineStyle: "none",
      transformOrigin: "var(--transform-origin)",
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "scale(0.96)" },
        ending: { opacity: 0, transform: "scale(0.96)" }
      }
    }
  }
})
