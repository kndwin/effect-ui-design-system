import * as Manifest from "@acme/design-system/Manifest"
import { AvatarStyle } from "../../feature/avatar/avatar.component.style.ts"
import { ButtonStyle } from "../../feature/button/button.component.style.ts"
import { CodeBlockStyle } from "../../feature/code-block/code-block.component.style.ts"
import { Tokens } from "../token/contract.token.ts"
import { CenterStyle } from "../../feature/layout/center.component.style.ts"
import { GridSpanStyle, GridStyle } from "../../feature/layout/grid.component.style.ts"
import {
  LayoutContentStyle,
  LayoutFooterStyle,
  LayoutHeaderStyle,
  LayoutPanelStyle,
  LayoutStyle
} from "../../feature/layout/layout.component.style.ts"
import { SectionStyle } from "../../feature/layout/section.component.style.ts"
import { StackItemStyle, StackStyle } from "../../feature/layout/stack.component.style.ts"
import { SwatchStyle } from "../../feature/swatch/swatch.component.style.ts"
import { TextStyle } from "../../feature/text/text.component.style.ts"

export const manifest = Manifest.make({
  tokens: Tokens,
  styles: [
    ButtonStyle,
    AvatarStyle,
    CodeBlockStyle,
    StackStyle,
    StackItemStyle,
    GridStyle,
    GridSpanStyle,
    CenterStyle,
    SectionStyle,
    LayoutStyle,
    LayoutHeaderStyle,
    LayoutPanelStyle,
    LayoutContentStyle,
    LayoutFooterStyle,
    TextStyle,
    SwatchStyle
  ]
})
