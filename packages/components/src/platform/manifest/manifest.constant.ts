import * as Manifest from "@acme/design-system/Manifest"
import { DialogStyle } from "../../feature/dialog/dialog.component.style.ts"
import { DrawerStyle } from "../../feature/drawer/drawer.component.style.ts"
import { PopoverStyle } from "../../feature/popover/popover.component.style.ts"
import { TooltipStyle } from "../../feature/tooltip/tooltip.component.style.ts"
import { MenuStyle } from "../../feature/menu/menu.component.style.ts"
import { ToastStyle } from "../../feature/toast/toast.component.style.ts"
import { CheckboxStyle } from "../../feature/checkbox/checkbox.component.style.ts"
import { FieldStyle } from "../../feature/field/field.component.style.ts"
import { InputStyle } from "../../feature/field/input.component.style.ts"
import { RadioGroupStyle } from "../../feature/radio-group/radio-group.component.style.ts"
import { SelectStyle } from "../../feature/select/select.component.style.ts"
import { SliderStyle } from "../../feature/slider/slider.component.style.ts"
import { SwitchStyle } from "../../feature/switch/switch.component.style.ts"
import { ToggleStyle } from "../../feature/toggle/toggle.component.style.ts"
import { AvatarStyle } from "../../feature/avatar/avatar.component.style.ts"
import { ButtonStyle } from "../button/button.component.style.ts"
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
    InputStyle,
    FieldStyle,
    CheckboxStyle,
    SwitchStyle,
    RadioGroupStyle,
    SelectStyle,
    SliderStyle,
    ToggleStyle,
    DialogStyle,
    DrawerStyle,
    PopoverStyle,
    TooltipStyle,
    MenuStyle,
    ToastStyle,
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
