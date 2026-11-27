import * as Style from "@acme/design-system/Style"
import { Avatar as KitAvatar } from "@effect/ui-kit/Avatar"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Hue } from "../scales.schema.ts"
import { AvatarStyle } from "./avatar.component.style.ts"
import { initials, pickByName } from "./avatar.pure.ts"

export type AvatarProps = Style.Props<typeof AvatarStyle>

export interface AvatarOptions {
  readonly name: string
  readonly src?: string | undefined

  readonly fallbackDelay?: number | undefined
  readonly key?: string | undefined
  readonly class?: string | undefined
}

export const Avatar = <Msg>(h: Html.H<Msg>, options: AvatarOptions & AvatarProps): Child<Msg> => {
  const classes = Style.classes(AvatarStyle, { ...options, hue: options.hue ?? pickByName(options.name, Hue.literals) })
  return KitAvatar(h, {
    ...(options.key === undefined ? {} : { key: options.key }),
    props: { src: options.src, fallbackDelay: options.fallbackDelay },
    view: (avatar) =>
      avatar
        .root(h.span.class(classes.root, options.class).attr("data-status", avatar.imageLoadingStatus))
        .children(
          avatar.image(h.img.class(classes.image).attr("alt", options.name)),
          avatar
            .fallback(h.span.class(classes.fallback).attr("aria-label", options.name))
            ?.children(initials(options.name))
        )
  })
}
