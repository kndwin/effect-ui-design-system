# effect-ui design system (PoC)

Typed tokens → Schema-backed variants → per-part styles for
[`@effect/ui-kit`](https://github.com/Effect-TS/ui), compiled to static CSS with vanilla-extract.

**Status:** milestones 1–3 of the handover (tokens, themes, Button with two variants),
plus a shadcn/ui Button rebuilt on the same primitives to test that the API is general.

## Setup

`@effect/ui` isn't on npm yet. It's pinned as a git submodule at `vendor/effect-ui`
(commit `9dc3482`) and linked with `link:`; the kit ships `.ts` source, so there's no build step.

```bash
git submodule update --init
pnpm install
pnpm check   # tsc, including the must-not-compile cases in packages/ds/test/types.test-d.ts
pnpm test    # server-render + manifest
pnpm dev     # playground: / (Cave Button) and /shadcn.html (shadcn gallery)
```

## Layout

```
packages/ds/src/
  Token.ts  Theme.ts  Variant.ts  Style.ts  DesignSystem.ts   # the library
  Kit.ts  Rule.ts                                              # kit descriptor + token-only CSS decl type
  kit/button.ts       # the ONE place that knows ui-kit Button's DOM contract
  tokens.ts           🔒 Cave tokens   (plain .ts: groups hold Schemas, which can't be serialised from .css.ts)
  themes.css.ts       🔒 Cave themes
  scales.ts           🔒 Tone, Size
  button.css.ts       # Cave ButtonStyle
  index.ts            # DS + Button
apps/playground/src/
  Editor.ts           # the handover's end-to-end example
  shadcn/             # a second design system on the same primitives
```

## Authoring in one screen

```ts
export const Colors = Token.group("color", Schema.Struct({ accent: Token.Color, /* … */ }))

export const dark = Theme.make({ Colors, Spacing, Radius }, { Colors: { accent: "#7c5cff", … }, … },
  { name: "dark", default: true })                                   // → :root

export const ButtonStyle = Style.make(Button)({                      // curried: kit first
  base: { root: { borderRadius: Radius.md, states: { disabled: { opacity: 0.5 } } } },
  variants: {
    tone: Variant.make(Tone, {
      primary: { root: { background: Colors.accent, color: Colors.accentFg } },
      …
    }, { default: "neutral" }),
  },
})

export const Button = DS.component(ButtonStyle)
Button(h, { tone: "primary", loading: model.saving, onPress: Msg.Save(), children: "Save" })
```

Packages that author `.css.ts` styles need `@vanilla-extract/css` and `@vanilla-extract/recipes`
as direct dependencies, because the compiled output imports them.
