# acme/ui: a design system for @effect/ui-kit (PoC)

Typed tokens → Schema-backed variants → per-part styles for
[`@effect/ui-kit`](https://github.com/Effect-TS/ui), compiled to static CSS at build time.
Components are written against a **token contract** (names and kinds only); **themes** fill the
contract in. Swap the theme, keep the components.

![The docs, composed only from @acme/components, with the theme builder open](apps/docs/screenshots/theme-builder.png)

## Setup

`@effect/ui` isn't on npm yet. It's pinned as a git submodule at `vendor/effect-ui`
(commit `9dc3482`) and linked with `link:`; the kit ships `.ts` source, so there's no build step.

```bash
git submodule update --init
pnpm install
pnpm docs    # live examples + their source, theme switcher, theme builder
pnpm ci      # oxfmt --check → oxlint + ast-grep → tsc (TypeScript 7) → vitest → docs build
```

## Layout

```
packages/
  ds/                    @acme/ds: the library (no barrel; one export per module)
    src/Token*.pure.ts         one module per token kind: TokenColor.make("color", ["accent", …])
    src/Style.pure.ts          Style.make(Kit)({ base, variants, compound }) → data
    src/Theme.pure.ts          Theme.make(Tokens, { name, values, modes }) → data
    src/Variant.pure.ts Manifest.pure.ts Rule.pure.ts highlight.pure.ts
    src/Compile.pure.ts        the adapter for @acme/css-engine
    src/kit/*.pure.ts          the only files that know ui-kit's DOM (parts, data attributes);
                               kit/layout + kit/element for the components the DS owns outright
  components/            @acme/components
    src/contract.token.ts  🔒  the token contract
    src/scales.pure.ts     🔒  variant value lists (Schemas)
    src/<name>/<name>.component.style.ts   how it looks (data)
    src/<name>/<name>.component.ts         what it renders; exports itself
      button/ avatar/ code-block/ text/ swatch/
      layout/  stack (Stack, HStack, VStack, StackItem) · grid (Grid, GridSpan) · center · section
               layout (Layout, LayoutHeader, LayoutPanel, LayoutContent, LayoutFooter)
    rule.component.style.md  rule.token.md
  themes/                rule.theme.md
    shadcn/  shadcn.theme.ts   (default, also on :root)
    astryx/  astryx.theme.ts
apps/docs/               composed only from @acme/components; no stylesheet
  css-engine/            @acme/css-engine: generic, no design-system knowledge
    src/rules.pure.ts          the input contract: recipes, global rules (plain data)
    src/register.build.ts      writes rules as CSS (vanilla-extract today)
    src/vite.build.ts          cssEngine({ include, adapter }) Vite plugin
    rule.build.md
tools/
  lint/plugin.ts         effect-oxlint rules: file-kind, pure, vanilla-imports, tokens-only
  ast-grep/rules/        the structural rules for each file kind
rule.pure.md  rule.component.md
```

## File kinds

Only these may exist under `packages/*/src`, `apps/*/src` and `test/`, and lint enforces it.
Each kind's rule is explained in a `rule.<kind>.md` at the root of where it's used. Lint fails if
a file has no rule doc above it.

| file                                      | contains                                           | rule doc                             | enforced by                                                                     |
| :---------------------------------------- | :------------------------------------------------- | :----------------------------------- | :------------------------------------------------------------------------------ |
| `*.component.ts`                          | UI: an `Html.component`, or a view function        | `rule.component.md`                  | ast-grep `component-exports-ui`                                                 |
| `*.component.style.ts`                    | only `Style.make(Kit)({…})`; tokens only           | `components/rule.component.style.md` | `acme/tokens-only`, `acme/pure`, ast-grep `style-exports-style`, `data-imports` |
| `*.token.ts`                              | only `Token*.make(…)` groups + the contract object | `components/rule.token.md`           | `acme/pure`, ast-grep `token-exports-tokens`                                    |
| `*.theme.ts`                              | only `Theme.make(Tokens, …)`                       | `themes/rule.theme.md`               | `acme/pure`, ast-grep `theme-exports-theme`                                     |
| `*.pure.ts`                               | pure functions and data                            | `rule.pure.md`                       | `acme/pure`, ast-grep `data-has-no-component`                                   |
| `main.ts`, `*.d.ts`, `test/*.test(-d).ts` | entry, declarations, tests                         |                                      | `acme/file-kind`                                                                |

No barrels: `index.ts` and re-exports are errors. Packages list each module in `package.json`
`exports` (`@acme/components/button`, `@acme/components/layout/stack`, …).

## Authoring in one screen

```ts
// components/src/contract.token.ts: names and kinds
export const Colors = TokenColor.make("color", ["surface", "fg", "accent", "accentFg", "danger"])
export const Radius = TokenLength.make("radius", ["control", "full"])
export const Tokens = { Colors, Radius /* … */ }

// themes/astryx/src/astryx.theme.ts: values, checked against the contract
export const astryx = Theme.make(Tokens, {
  name: "astryx",
  values: { Colors: { accent: "#1b1b1b" /* … */ }, Radius: { control: 12, full: 9999 } /* … */ },
  modes: { dark: { Colors: { accent: "#f1f1f1" /* … */ } } }
})

// components/src/button/button.component.style.ts: how it looks
export const ButtonStyle = Style.make(Button)({
  base: { root: { borderRadius: Radius.control, states: { disabled: { opacity: 0.5 } } } },
  variants: { tone: Variant.make(Tone, { primary: { root: { background: Colors.accent } } /* … */ }) }
})

// components/src/button/button.component.ts: what it renders
export const Button = (h, options) => renderButton(h, options, Style.classes(ButtonStyle, options))

// an app
import "@acme/theme-astryx"
Layout(h.div)
  .attr("data-theme", "astryx")
  .attr("data-mode", "dark")
  .children(
    LayoutHeader(h.header).children(Text(h.strong, { weight: "semibold" }).children("App")),
    LayoutContent(h.main).children(
      HStack(h.div, { gap: "3" }).children(
        Avatar(h, { name: "Ada Lovelace", src: user.photo }),
        Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })
      )
    )
  )
```

## How styles become CSS: `@acme/css-engine`

A generic engine with no knowledge of tokens, kits or Effect UI:

```ts
// vite.config.ts
cssEngine({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/ds/Compile" })
```

- **Input:** files matching `include` export plain data. The **adapter** (`@acme/ds/Compile`) turns
  each export into engine rules (`rules.pure.ts`): recipes (a class per variant value) and global rules.
- **Build:** `register.build.ts` writes those rules. vanilla-extract's compiler runs it
  and emits static CSS. Importers get the compiled exports plus a CSS import.
- **Hosts:** dev with hot reload, vitest and production builds.
- **Isolation:** vanilla-extract is a dependency of `@acme/css-engine` only (lint: `acme/vanilla-imports`). Its
  imports resolve from the engine, so component and theme packages don't install it.
- **Proof it's generic:** `packages/css-engine/test` compiles a fixture with a fixture adapter, no design system.

Swapping vanilla-extract for our own engine changes only `register.build.ts` and `vite.build.ts`.
