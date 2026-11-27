import * as Manifest from "@acme/design-system/Manifest"
import { AvatarStyle } from "./avatar/avatar.component.style.ts"
import { ButtonStyle } from "./button/button.component.style.ts"
import { CodeBlockStyle } from "./code-block/code-block.component.style.ts"
import { Tokens } from "./contract.token.ts"
import { CenterStyle } from "./layout/center.component.style.ts"
import { GridSpanStyle, GridStyle } from "./layout/grid.component.style.ts"
import {
  LayoutContentStyle,
  LayoutFooterStyle,
  LayoutHeaderStyle,
  LayoutPanelStyle,
  LayoutStyle
} from "./layout/layout.component.style.ts"
import { SectionStyle } from "./layout/section.component.style.ts"
import { StackItemStyle, StackStyle } from "./layout/stack.component.style.ts"
import { SwatchStyle } from "./swatch/swatch.component.style.ts"
import { TextStyle } from "./text/text.component.style.ts"

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
