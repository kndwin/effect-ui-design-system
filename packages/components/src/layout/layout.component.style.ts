import * as Style from "@acme/design-system/Style"
import * as TokenLength from "@acme/design-system/TokenLength"
import * as Variant from "@acme/design-system/Variant"
import {
  LayoutParts,
  LayoutContentParts,
  LayoutFooterParts,
  LayoutHeaderParts,
  LayoutPanelParts
} from "./layout.parts.constant.ts"
import { Colors, Font, Size, Spacing, Stroke, Text } from "../contract.token.ts"
import { SideSchema } from "../scales.schema.ts"

const rule = { borderStyle: "solid", borderColor: Colors.border, borderWidth: 0 } as const

export const LayoutStyle = Style.make(LayoutParts)({
  base: {
    root: {
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateAreas: `"header header header" "start content end" "footer footer footer"`,
      minHeight: "100vh",
      background: Colors.surface,
      color: Colors.fg,
      fontFamily: Font.body,
      fontSize: Text.sm,
      lineHeight: 1.6,
      media: {
        narrow: {
          gridTemplateColumns: "minmax(0, 1fr)",
          gridTemplateRows: "auto",
          gridTemplateAreas: `"header" "start" "content" "end" "footer"`
        }
      }
    }
  }
})

export const LayoutHeaderStyle = Style.make(LayoutHeaderParts)({
  base: {
    root: {
      ...rule,
      gridArea: "header",
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[4],
      height: Size.header,
      paddingInline: Spacing[6],
      background: Colors.surface,
      borderBottomWidth: Stroke.border,
      media: { narrow: { paddingInline: Spacing[4], position: "static" } }
    }
  }
})

export const LayoutPanelStyle = Style.make(LayoutPanelParts)({
  base: {
    root: {
      ...rule,
      boxSizing: "border-box",
      position: "sticky",
      top: Size.header,
      alignSelf: "start",
      maxHeight: TokenLength.makeCalc`100vh - ${Size.header}`,
      overflowY: "auto",
      padding: Spacing[6],
      media: { narrow: { position: "static", maxHeight: "none", width: "auto", padding: Spacing[4] } }
    }
  },
  variants: {
    side: Variant.make(
      SideSchema,
      {
        start: { root: { gridArea: "start", width: Size.sidebar, borderRightWidth: Stroke.border } },
        end: {
          root: {
            gridArea: "end",
            width: Size.panel,
            borderLeftWidth: Stroke.border,
            background: Colors.surface,
            media: { narrow: { borderLeftWidth: 0, borderTopWidth: Stroke.border } }
          }
        }
      },
      { default: "start" }
    )
  }
})

export const LayoutContentStyle = Style.make(LayoutContentParts)({
  base: {
    root: {
      gridArea: "content",
      boxSizing: "border-box",
      minWidth: 0,
      maxWidth: Size.content,
      paddingInline: Spacing[12],
      paddingBlock: Spacing[8],
      media: { narrow: { paddingInline: Spacing[4], paddingBlock: Spacing[6] } }
    }
  }
})

export const LayoutFooterStyle = Style.make(LayoutFooterParts)({
  base: {
    root: {
      ...rule,
      gridArea: "footer",
      paddingInline: Spacing[6],
      paddingBlock: Spacing[4],
      borderTopWidth: Stroke.border,
      color: Colors.fgMuted
    }
  }
})
