import type { ButtonElement } from "@effect/ui-kit/Button"
import { type ButtonOptions, renderButton } from "./kit/button.ts"
import { type Props, type Style, classes } from "./Style.ts"
import type { Theme } from "./Theme.ts"
import { type AnyGroup, GroupTypeId } from "./Token.ts"

// Per-kit wrapper signatures. Written out (not computed) so `Msg` stays generic.
interface Components<P> {
  Button: <Msg, R = never>(
    h: { readonly button: ButtonElement<Msg> },
    options: ButtonOptions<Msg, R> & P
  ) => ButtonElement<Msg, R>
}
const renderers: { readonly [K in keyof Components<any>]: (h: any, o: any, c: any) => any } = {
  Button: renderButton
}
const variantKeys = (s: Style<any, any, any>) => new Set(Object.keys(s.variants))

export const make = <const S extends ReadonlyArray<Style<keyof Components<any>, any, any>>>(config: {
  readonly tokens: Readonly<Record<string, AnyGroup>>
  readonly themes: ReadonlyArray<Theme>
  readonly styles: S
}) => {
  const seen = new Map<string, string>()
  for (const [name, g] of Object.entries(config.tokens)) {
    const prefix = g[GroupTypeId].prefix
    const other = seen.get(prefix)
    if (other) throw new Error(`Token groups ${other} and ${name} share the prefix "${prefix}"`)
    seen.set(prefix, name)
  }
  for (const t of config.themes) {
    for (const p of t.prefixes) {
      if (!seen.has(p)) throw new Error(`Theme "${t.name}" sets --${p}-* but that group isn't registered`)
    }
  }

  return {
    component: <St extends S[number]>(style: St): Components<Props<St>>[St["kit"]] => {
      const render = renderers[style.kit as keyof Components<any>]
      const keys = variantKeys(style)
      return ((h: any, options: any) => {
        const props: Record<string, unknown> = {}
        const rest: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(options)) (keys.has(k) ? props : rest)[k] = v
        return render(h, rest, classes(style, props))
      }) as any
    },
    manifest: {
      components: config.styles.map((s) => ({ kit: s.kit, slots: Object.keys(s.slots), variants: s.variants })),
      tokens: Object.fromEntries(
        Object.entries(config.tokens).map(([n, g]) => [n, { prefix: g[GroupTypeId].prefix, keys: Object.keys(g[GroupTypeId].schema.fields) }])
      )
    }
  }
}
