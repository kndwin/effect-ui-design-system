import * as Style from "@acme/design-system/Style"
import { Avatar as KitAvatar } from "@effect/ui-kit/Avatar"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Hue } from "../scales.schema.ts"
import { AvatarStyle } from "./avatar.component.style.ts"
import type { AvatarOptions } from "./avatar.schema.ts"
import { getByName, getInitials } from "./avatar.pure.ts"
import { Match } from "effect"

export type AvatarProps = Style.Props<typeof AvatarStyle>

export const Avatar = <Msg>(h: Html.H<Msg>, options: AvatarOptions & AvatarProps): Child<Msg> => {
  const classes = Style.classes(AvatarStyle, {
    ...options,
    hue: options.hue ?? getByName({ name: options.name, values: Hue.literals })
  })
  return KitAvatar(h, {
    ...Match.value(options.key === undefined).pipe(
      Match.when(true, () => ({})),
      Match.orElse(() => ({ key: options.key }))
    ),
    props: { src: options.src, fallbackDelay: options.fallbackDelay },
    view: (avatar) =>
      avatar
        .root(h.span.class(classes.root, options.class).attr("data-status", avatar.imageLoadingStatus))
        .children(
          avatar.image(h.img.class(classes.image).attr("alt", options.name)),
          avatar
            .fallback(h.span.class(classes.fallback).attr("aria-label", options.name))
            ?.children(getInitials({ name: options.name }))
        )
  })
}
