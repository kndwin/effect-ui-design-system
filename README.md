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
pnpm ci      # oxfmt --check → oxlint + ast-grep → tsc (TypeScript 7) → vitest → rule tests → docs build
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
    component.style.rule.{md,yml,ts}   token.rule.{md,yml}
  themes/                theme.rule.{md,yml}
    shadcn/  shadcn.theme.ts   (default, also on :root)
    astryx/  astryx.theme.ts
apps/docs/               composed only from @acme/components; no stylesheet
  css-engine/            @acme/css-engine: generic, no design-system knowledge
    src/rules.pure.ts          the input contract: recipes, global rules (plain data)
    src/register.build.ts      writes rules as CSS (vanilla-extract today)
    src/vite.build.ts          cssEngine({ include, adapter }) Vite plugin
    build.rule.md
tools/
  lint/                  finds every *.rule.ts / *.rule.yml, runs them, and tests every *.rule.md
  ast-grep/rules/        the structural rules for each file kind
file-kind.rule.{md,yml,ts}  comments.rule.{md,yml,ts}  pure.rule.{md,yml,ts}  component.rule.{md,yml}
oxlint.config.ts           loads every *.rule.ts
```

## Rules: `<kind>.rule.{md,yml,ts}`

Every convention is written down and checked by up to three files, kept together in the folder
the rule applies to. A rule covers files of its kind in that folder and below.

| file              | role                                                                               | read by                                       |
| :---------------- | :--------------------------------------------------------------------------------- | :-------------------------------------------- |
| `<kind>.rule.md`  | **the contract**: what's allowed and why, how to fix it, ✅/❌ examples. Required. | people, agents, the rule tests                |
| `<kind>.rule.yml` | **shape**: what a file of this kind may export and import                          | ast-grep (`tools/lint/ast-grep.build.ts`)     |
| `<kind>.rule.ts`  | **meaning**: checks that need code (file system, scopes, values, comments)         | oxlint via effect-oxlint (`oxlint.config.ts`) |

The ✅/❌ examples in each `.rule.md` are the test suite (`pnpm test:rules`). Each ✅ must pass
both tools, and each ❌ must fail with the rule id its heading names (`→ component.style/tokens-only`).

| rule              | where                 | covers                                                                                                       |
| :---------------- | :-------------------- | :----------------------------------------------------------------------------------------------------------- |
| `file-kind`       | root                  | allowed kinds, a `.rule.md` above every file, no barrels or re-exports, vanilla-extract only in `*.build.ts` |
| `comments`        | root                  | no comments in any `.ts` (except `@ts-expect-error` in type tests)                                           |
| `pure`            | root                  | `*.pure.ts` and the data kinds: no effects, no non-determinism, no module state, no components               |
| `component`       | root                  | `*.component.ts` exports UI                                                                                  |
| `component.style` | `packages/components` | only `Style.make(…)` exports, tokens only, `@acme/*` imports only                                            |
| `token`           | `packages/components` | the contract: only `Token*.make(…)` groups                                                                   |
| `theme`           | `packages/themes`     | only `Theme.make(Tokens, …)`                                                                                 |
| `build`           | `packages/css-engine` | build-time Node code; the only place vanilla-extract is allowed                                              |

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
- **Isolation:** vanilla-extract is a dependency of `@acme/css-engine` only (rule: `file-kind/vanilla-imports`). Its
  imports resolve from the engine, so component and theme packages don't install it.
- **Proof it's generic:** `packages/css-engine/test` compiles a fixture with a fixture adapter, no design system.

Swapping vanilla-extract for our own engine changes only `register.build.ts` and `vite.build.ts`.
