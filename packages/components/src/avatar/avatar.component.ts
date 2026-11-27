import { type AvatarOptions, pickByName, renderAvatar } from "@acme/ds/kit/avatar"
import * as Style from "@acme/ds/Style"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Hue } from "../scales.pure.ts"
import { AvatarStyle } from "./avatar.component.style.ts"

export type AvatarProps = Style.Props<typeof AvatarStyle>

/** `Avatar(h, { name, src, size, shape })`. The fallback's hue comes from the name unless given. */
export const Avatar = <Msg>(h: Html.H<Msg>, options: AvatarOptions & AvatarProps): Child<Msg> =>
  renderAvatar(
    h,
    options,
    Style.classes(AvatarStyle, { ...options, hue: options.hue ?? pickByName(options.name, Hue.literals) })
  )
