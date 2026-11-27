import * as Style from "@acme/ds/Style"
import * as Variant from "@acme/ds/Variant"
import { Avatar } from "@acme/ds/kit/avatar"
import { AvatarSize, Hue, Shape } from "../scales.pure.ts"
import { Colors, Font, Hues, Radius, Size, Stroke, Text, Weight } from "../contract.token.ts"

export const AvatarStyle = Style.make(Avatar)({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      verticalAlign: "middle",
      userSelect: "none",
      background: Colors.surfaceMuted,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      // the hue is only for the initials: once the image is in, it would show as a ring
      states: { loaded: { background: Colors.surface } }
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    fallback: { fontFamily: Font.body, fontWeight: Weight.semibold, color: Hues.onHue, lineHeight: 1 }
  },
  variants: {
    size: Variant.make(
      AvatarSize,
      {
        sm: { root: { width: Size.avatarSm, height: Size.avatarSm }, fallback: { fontSize: Text.xs } },
        md: { root: { width: Size.avatarMd, height: Size.avatarMd }, fallback: { fontSize: Text.sm } },
        lg: { root: { width: Size.avatarLg, height: Size.avatarLg }, fallback: { fontSize: Text.md } }
      },
      { default: "md" }
    ),
    shape: Variant.make(
      Shape,
      {
        circle: { root: { borderRadius: Radius.full } },
        square: { root: { borderRadius: Radius.avatarSquare } }
      },
      { default: "circle" }
    ),
    // Only visible while the fallback shows; the image covers it once loaded.
    hue: Variant.make(Hue, {
      blue: { root: { background: Hues.blue } },
      green: { root: { background: Hues.green } },
      amber: { root: { background: Hues.amber } },
      rose: { root: { background: Hues.rose } }
    })
  }
})
