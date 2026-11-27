// The ONE place that knows ui-kit Avatar's DOM contract. ui-kit's Avatar sets no
// data attributes; the design system adds `data-status` on the root so styles
// can react to the image's load state.
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
  /** Required: used for the image's alt text and the fallback initials. */
  readonly name: string
  readonly src?: string | undefined
  /** ms before the initials show, so a fast image doesn't flash them */
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

/** Stable pick from a list of values by name, e.g. the fallback's hue. */
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
