import * as Style from "@weft/design-system/Style"
import * as Variant from "@weft/design-system/Variant"
import { DrawerSideSchema } from "../../platform/scale/scales.schema.ts"
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
import { DrawerParts } from "./drawer.parts.constant.ts"

const swipe = "translate(var(--drawer-swipe-movement-x, 0%), var(--drawer-swipe-movement-y, 0%))"

export const DrawerStyle = Style.make(DrawerParts)({
  base: {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: Colors.overlay,
      opacity: "calc(1 - var(--drawer-swipe-progress, 0))",
      transitionProperty: "opacity",
      transitionDuration: Motion.fast,
      states: { starting: { opacity: 0 }, ending: { opacity: 0 } }
    },
    viewport: { position: "fixed", inset: 0, pointerEvents: "none" },
    popup: {
      boxSizing: "border-box",
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[4],
      padding: Spacing[6],
      overflowY: "auto",
      pointerEvents: "auto",
      fontFamily: Font.body,
      color: Colors.fg,
      background: Colors.surface,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderWidth: 0,
      boxShadow: Shadow.overlay,
      outlineStyle: "none",
      transform: swipe,
      transitionProperty: "transform",
      transitionDuration: Motion.fast,
      transitionTimingFunction: "ease-out"
    },
    title: { margin: 0, fontSize: Text.lg, fontWeight: Weight.semibold },
    description: { margin: 0, fontSize: Text.sm, color: Colors.fgMuted, lineHeight: 1.5 },
    content: { flexGrow: 1, fontSize: Text.sm, lineHeight: 1.5 },
    footer: { display: "flex", justifyContent: "flex-end", gap: Spacing[2] },
    handle: {
      alignSelf: "center",
      width: Size.controlMd,
      height: Spacing[1],
      background: Colors.border,
      borderRadius: Radius.full
    }
  },
  variants: {
    side: Variant.make(
      DrawerSideSchema,
      {
        right: {
          popup: {
            top: 0,
            right: 0,
            bottom: 0,
            width: Size.drawer,
            maxWidth: "100%",
            borderLeftWidth: Stroke.border,
            states: { starting: { transform: "translateX(100%)" }, ending: { transform: "translateX(100%)" } }
          },
          handle: { display: "none" }
        },
        left: {
          popup: {
            top: 0,
            left: 0,
            bottom: 0,
            width: Size.drawer,
            maxWidth: "100%",
            borderRightWidth: Stroke.border,
            states: { starting: { transform: "translateX(-100%)" }, ending: { transform: "translateX(-100%)" } }
          },
          handle: { display: "none" }
        },
        bottom: {
          popup: {
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: "100vh",
            borderTopWidth: Stroke.border,
            borderTopLeftRadius: Radius.container,
            borderTopRightRadius: Radius.container,
            states: { starting: { transform: "translateY(100%)" }, ending: { transform: "translateY(100%)" } }
          }
        }
      },
      { default: "right" }
    )
  }
})
