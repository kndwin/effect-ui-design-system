import { Avatar as KitAvatar } from "@effect/ui-kit/Avatar"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import * as Kit from "../Kit.pure.ts"

const AvatarDescriptor = Kit.describe({
  name: "Avatar",
  parts: {
    root: {
      states: { loading: "[data-status=loading]", loaded: "[data-status=loaded]", error: "[data-status=error]" }
    },
    image: { states: {} },
    fallback: { states: {} }
  },
  vars: {},
  pseudo: []
})
export interface AvatarKit extends Kit.Type<typeof AvatarDescriptor> {}
export const Avatar: AvatarKit = AvatarDescriptor

export interface AvatarOptions {
  readonly name: string
  readonly src?: string | undefined

  readonly fallbackDelay?: number | undefined
  readonly key?: string | undefined
  readonly class?: string | undefined
}

export const initials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.length > 1 ? [words[0]!, words[words.length - 1]!] : words
  return letters
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2)
}

export const pickByName = <A>(name: string, values: ReadonlyArray<A>): A => {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return values[Math.abs(hash) % values.length]!
}

export const renderAvatar = <Msg>(
  h: Html.H<Msg>,
  options: AvatarOptions,
  classes: { readonly root: string; readonly image: string; readonly fallback: string }
): Child<Msg> =>
  KitAvatar(h, {
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
