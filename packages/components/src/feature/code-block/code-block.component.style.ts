import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import * as TokenLength from "@weft/design-system/TokenLength"
import * as Variant from "@weft/design-system/Variant"
import { CodeBlockParts } from "./code-block.parts.constant.ts"
import { CodeToneSchema, ControlSizeSchema } from "../../platform/scale/scales.schema.ts"
import {
  Code,
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size as Sizes,
  Spacing,
  Stroke,
  Syntax,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"

export const CodeBlockStyle = Style.make(CodeBlockParts)({
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
      background: Code.surface,
      color: Code.fg,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Code.border,
      borderRadius: Radius.container
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[2],
      paddingInline: Spacing[4],
      paddingBlock: Spacing[1],
      borderBottomWidth: Stroke.border,
      borderBottomStyle: "solid",
      borderBottomColor: Code.border
    },
    title: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: Font.mono,
      fontSize: Text.xs,
      fontWeight: Weight.medium,
      color: Code.muted
    },
    copy: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: Sizes.controlSm,
      height: Sizes.controlSm,
      padding: 0,
      borderWidth: 0,
      borderRadius: Radius.control,
      background: TokenColor.makeAlpha(Code.fg, 0),
      color: Code.muted,
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: Motion.fast,
      states: {
        hover: { background: TokenColor.makeAlpha(Code.fg, 8), color: Code.fg },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring },
        copied: { color: Code.fg },
        floating: { position: "absolute", top: Spacing[2], right: Spacing[2], zIndex: 1, background: Code.surface }
      }
    },
    content: {
      margin: 0,
      overflow: "auto",
      paddingBlock: Spacing[4],
      fontFamily: Font.mono,
      lineHeight: 1.7,
      whiteSpace: "pre",
      tabSize: 2,
      states: {
        wrap: { whiteSpace: "pre-wrap", overflowWrap: "anywhere" },
        focusVisible: { outline: "none" },
        collapsed: { maxHeight: TokenLength.makeCalc`${Sizes.header} * 2`, overflow: "hidden" }
      }
    },
    expand: {
      position: "absolute",
      insetInline: 0,
      bottom: 0,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      height: Sizes.header,
      paddingBottom: Spacing[3],
      backgroundImage: `linear-gradient(to bottom, ${TokenColor.makeAlpha(Code.surface, 0)}, ${Code.surface})`
    },
    expandButton: {
      height: Sizes.controlSm,
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Code.fg,
      background: Code.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Code.border,
      borderRadius: Radius.control,
      boxShadow: Shadow.control,
      cursor: "pointer",
      states: {
        hover: { borderColor: Code.muted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        }
      }
    },
    line: {
      display: "block",
      paddingInline: Spacing[4],
      states: {
        highlighted: { background: Code.lineHighlighted },
        added: { background: Code.lineAdded },
        removed: { background: Code.lineRemoved }
      }
    },
    lineNumber: {
      display: "inline-block",
      minWidth: Spacing[6],
      marginRight: Spacing[4],
      textAlign: "right",
      color: Code.muted,
      userSelect: "none"
    },
    token: {
      states: {
        comment: { color: Syntax.comment, fontStyle: "italic" },
        string: { color: Syntax.string },
        keyword: { color: Syntax.keyword },
        number: { color: Syntax.number },
        type: { color: Syntax.type },
        call: { color: Syntax.call }
      }
    }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      {
        sm: { content: { fontSize: Text.xs, paddingBlock: Spacing[3] }, line: { paddingInline: Spacing[3] } },
        md: { content: { fontSize: Text.code } }
      },
      { default: "md" }
    ),
    tone: Variant.make(
      CodeToneSchema,
      {
        default: {},
        destructive: { root: { borderColor: Colors.danger }, title: { color: Colors.danger } }
      },
      { default: "default" }
    )
  }
})
