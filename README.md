# acme/ui: a design system for @effect/ui-kit (PoC)

Typed tokens → Schema-backed variants → per-part styles for
[`@effect/ui-kit`](https://github.com/Effect-TS/ui), compiled to static CSS at build time by our own
Effect-based engine. Components are written against a **token contract** (names and kinds only);
**themes** fill the contract in. Swap the theme, keep the components.

![The docs, composed only from @acme/components, with the theme builder open](apps/docs/screenshots/theme-builder.png)

## Setup

`@effect/ui` isn't on npm yet. It's pinned as a git submodule at `vendor/effect-ui`
(commit `9dc3482`) and linked with `link:`; the kit ships `.ts` source, so there's no build step.

```bash
git submodule update --init
pnpm install
pnpm docs    # live examples + their source, theme switcher, theme builder
pnpm ci      # oxfmt → oxlint + ast-grep → tsc (TypeScript 7) → every package's tests → rule tests → docs build
```

## Packages

```
packages/
  design-system/   @acme/design-system: the generic library. No ui-kit, no CSS engine.
    src/tokens/      token.constant.ts, token.pure.ts, token-color.make.ts, … (one per kind)
    src/theme/       theme.make.ts        Theme.make(Tokens, { name, values, modes })
    src/style/       style.make.ts        Style.make(Parts)({ base, variants, compound }); rule.constant.ts
    src/variant/     variant.make.ts      Variant.make(Schema, …), Variant.flag(…)
    src/kit/         kit.make.ts          Kit.make / Kit.single: the parts-and-states descriptor type
    src/element/     element.pure.ts      Element.styled(Style): a component from a style, for any element
    src/manifest/    manifest.make.ts     tokens + components, as data
    src/compile/     compile.pure.ts      the adapter for @acme/css-engine
  components/      @acme/components
    src/contract.token.ts   🔒 the token contract
    src/scales.schema.ts    🔒 variant value lists (Schemas)
    src/<name>/<name>.parts.constant.ts    the ui-kit DOM contract: parts and states
    src/<name>/<name>.component.style.ts   how it looks (data)
    src/<name>/<name>.component.ts         what it renders; wires ui-kit; or just Element.styled(Style)
      button avatar code-block text swatch, layout/ (Stack, Grid, Center, Section, Layout…)
  themes/          @acme/theme-shadcn, @acme/theme-astryx   (<name>.theme.ts)
  css-engine/      @acme/css-engine: generic, Effect-based, no design-system knowledge
apps/docs/         composed only from @acme/components; no stylesheet
tools/lint/        finds every +rule/<rule>/<rule>.{lint.ts,yml}, runs them, tests every <rule>.md (all Effect programs)
```

No barrels: each package lists its modules in `package.json` `exports`
(`@acme/design-system/TokenColor`, `@acme/components/button`, …).

## Rules: `+rule/<rule>/<rule>.{md,yml,lint.ts}`

Every convention is written down and checked in a `+rule/<rule>/` folder next to the code it covers.
A rule applies to files of its kind in the folder holding `+rule/`, and below.

| file             | role                                                                | read by                                       |
| :--------------- | :------------------------------------------------------------------ | :-------------------------------------------- |
| `<rule>.md`      | **the contract**: what's allowed and why, ✅/❌ examples. Required. | people, agents, `pnpm test:rules`             |
| `<rule>.yml`     | **shape**: what a file may export and import                        | ast-grep (`tools/lint/ast-grep.build.ts`)     |
| `<rule>.lint.ts` | **meaning**: file system, scopes, values, comments                  | oxlint via effect-oxlint (`oxlint.config.ts`) |

The ✅/❌ blocks in each `<rule>.md` are the rule tests. Each ✅ passes both tools, and each ❌
fails with the id its heading names (`→ component-style-files/tokens-only`).

| rule                    | where                 | covers                                                                                       |
| :---------------------- | :-------------------- | :------------------------------------------------------------------------------------------- |
| `allowed-file-kinds`    | root                  | allowed kinds, kebab-case names, a rule doc above every file, colocated tests, no barrels    |
| `no-comments`           | root                  | no comments in any `.ts`, except `@ts-expect-error` and `// Arrange / Act / Assert` in tests |
| `no-ternary`            | root                  | no `a ? b : c`: branch with `Match` from `effect`                                            |
| `pure-files`            | root                  | data kinds have no effects; `*.pure.ts` exports only functions and has a `*.pure.test.ts`    |
| `schema-files`          | root                  | a `*.schema.ts` exports only Schemas, and imports only `effect`, `@effect/ui` and schemas    |
| `constant-files`        | root                  | a `*.constant.ts` exports values, no functions                                               |
| `make-files`            | root                  | a `*.make.ts` exports `make`                                                                 |
| `test-files`            | root                  | tests import `@effect/vitest`, and every test is `// Arrange`, `// Act`, `// Assert`         |
| `component-files`       | `packages/components` | a library component: `Html.component`, a view function or `Element.styled(Style)`            |
| `component-files`       | `apps/docs`           | an app component: an `Html.component`; examples also export `title` and `order`              |
| `component-style-files` | `packages/components` | only `Style.make(…)` exports, tokens only, `@acme/*` imports only                            |
| `token-files`           | `packages/components` | the contract: only `Token*.make(…)` groups                                                   |
| `theme-files`           | `packages/themes`     | only `Theme.make(Tokens, …)`                                                                 |
| `build-files`           | `packages/css-engine` | build-time Node code (doc only)                                                              |

## The CSS engine: `@acme/css-engine`

```ts
cssEngine({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/design-system/Compile" })
```

- **Evaluate:** each file matching `include` is loaded in Node through an internal Vite module runner.
- **Adapt:** the adapter (`compile(value, exportName)`) turns each export into plain rules (`rules.pure.ts`):
  recipes (a class per variant value) and global rules.
- **Write:** pure functions serialise the rules (`css.pure.ts`), name classes (`hash.pure.ts`: readable in dev,
  short in builds) and generate the importer's module (`codegen.pure.ts`). That module imports a virtual CSS
  file and a ~20-line browser runtime (`runtime.pure.ts`) that picks variant classes.
- **Effect:** `engine.build.ts` is an Effect program over a `ModuleLoader` service, with typed
  `EvaluationError` / `AdapterError`. The Vite plugin runs it on a `ManagedRuntime` whose layer owns the
  inner Vite server (acquired and released as a scoped resource). A bad theme value fails the build with
  a typed `InvalidTokensError` and its path.
- **Hosts:** dev with hot reload, vitest, and production builds. `packages/css-engine/test` compiles a fixture
  with a fixture adapter, with no design system.

## Authoring in one screen

```ts
// components/src/contract.token.ts: names and kinds
export const Colors = TokenColor.make("color", ["surface", "fg", "accent", "accentFg", "danger"])
export const Tokens = { Colors /* … */ }

// themes/astryx/src/astryx.theme.ts: values, checked against the contract
export const astryx = Theme.make(Tokens, { name: "astryx", values: { Colors: { accent: "#1b1b1b" /* … */ } /* … */ } })

// components/src/layout/center.component.ts: a styled element is one line
export const Center = Element.styled(CenterStyle)

// components/src/button/button.component.style.ts: how it looks
export const ButtonStyle = Style.make(ButtonParts)({
  base: { root: { borderRadius: Radius.control, states: { disabled: { opacity: 0.5 } } } },
  variants: { tone: Variant.make(Tone, { primary: { root: { background: Colors.accent } } /* … */ }) }
})

// an app
import "@acme/theme-astryx"
Layout(h.div)
  .attr("data-theme", "astryx")
  .attr("data-mode", "dark")
  .children(
    LayoutContent(h.main).children(
      HStack(h.div, { gap: "3" }).children(
        Avatar(h, { name: "Ada Lovelace" }),
        Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })
      )
    )
  )
```
