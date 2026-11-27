import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as Variant from "@acme/design-system/Variant"
import { CodeBlockParts } from "./code-block.parts.constant.ts"
import { CodeTone, ControlSize } from "../scales.schema.ts"
import {
  Code,
  Colors,
  Font,
  Motion,
  Radius,
  Size as Sizes,
  Spacing,
  Stroke,
  Syntax,
  Text,
  Weight
} from "../contract.token.ts"

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
      background: TokenColor.alpha(Code.fg, 0),
      color: Code.muted,
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: Motion.fast,
      states: {
        hover: { background: TokenColor.alpha(Code.fg, 8), color: Code.fg },
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
      states: { wrap: { whiteSpace: "pre-wrap", overflowWrap: "anywhere" }, focusVisible: { outline: "none" } }
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
      ControlSize,
      {
        sm: { content: { fontSize: Text.xs, paddingBlock: Spacing[3] }, line: { paddingInline: Spacing[3] } },
        md: { content: { fontSize: Text.code } }
      },
      { default: "md" }
    ),
    tone: Variant.make(
      CodeTone,
      {
        default: {},
        destructive: { root: { borderColor: Colors.danger }, title: { color: Colors.danger } }
      },
      { default: "default" }
    )
  }
})
