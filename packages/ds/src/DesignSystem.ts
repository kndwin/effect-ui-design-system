import type { ButtonElement } from "@effect/ui-kit/Button"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { type AvatarOptions, renderAvatar } from "./kit/avatar.ts"
import { type ButtonOptions, renderButton } from "./kit/button.ts"
import { type Props, type Style, classes } from "./Style.ts"
import type { Contract } from "./Theme.ts"
import { GroupTypeId } from "./Token.ts"

// Per-kit wrapper signatures. Written out (not computed) so `Msg` stays generic.
interface Components<P> {
  Button: <Msg, R = never>(
    h: { readonly button: ButtonElement<Msg> },
    options: ButtonOptions<Msg, R> & P
  ) => ButtonElement<Msg, R>
  Avatar: <Msg>(h: Html.H<Msg>, options: AvatarOptions & P) => Child<Msg>
}
const renderers: { readonly [K in keyof Components<any>]: (h: any, o: any, c: any) => any } = {
  Button: renderButton,
  Avatar: renderAvatar
}

/**
 * Variant values a component derives from its other options when the caller
 * leaves them out, e.g. an Avatar's hue from its name.
 */
export type Derive<St> = (options: any) => Partial<Props<St>>
const variantKeys = (s: Style<any, any, any>) => new Set(Object.keys(s.variants))

/**
 * A component library: a token contract (names only; themes supply values)
 * plus the styles written against it.
 */
export const make = <
  const T extends Contract,
  const S extends ReadonlyArray<Style<keyof Components<any>, any, any>>
>(config: {
  readonly tokens: T
  readonly styles: S
}) => {
  const seen = new Map<string, string>()
  for (const [name, g] of Object.entries(config.tokens)) {
    const prefix = g[GroupTypeId].prefix
    const other = seen.get(prefix)
    if (other) throw new Error(`Token groups ${other} and ${name} share the prefix "${prefix}"`)
    seen.set(prefix, name)
  }

  return {
    tokens: config.tokens,
    component: <St extends S[number]>(style: St, derive?: Derive<St>): Components<Props<St>>[St["kit"]] => {
      const render = renderers[style.kit as keyof Components<any>]
      const keys = variantKeys(style)
      return ((h: any, options: any) => {
        const props: Record<string, unknown> = { ...derive?.(options) }
        const rest: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(options)) {
          if (v !== undefined) (keys.has(k) ? props : rest)[k] = v
        }
        return render(h, rest, classes(style, props))
      }) as any
    },
    manifest: {
      components: config.styles.map((s) => ({ kit: s.kit, slots: Object.keys(s.slots), variants: s.variants })),
      tokens: Object.fromEntries(
        Object.entries(config.tokens).map(([n, g]) => [
          n,
          { prefix: g[GroupTypeId].prefix, kind: g[GroupTypeId].kind, keys: g[GroupTypeId].keys.map(String) }
        ])
      )
    }
  }
}
