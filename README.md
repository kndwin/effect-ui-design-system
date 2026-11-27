<p align="center">
  <img src="assets/logo.svg" alt="" width="96" height="96" />
</p>

<h1 align="center">Weft</h1>

<p align="center">
  A themeable design system for <a href="https://github.com/Effect-TS/ui"><code>@effect/ui-kit</code></a>, styled at build time.
  <br />
  <a href="https://weft-docs.kndwin.workers.dev"><strong>Docs</strong></a> ·
  <a href="https://weft-docs.kndwin.workers.dev/get-started">Get started</a>
</p>

Components are styled against a token contract, and a theme fills that contract in. Like shadcn,
you copy the components into your app and own them. Styles are typed TypeScript, compiled to static
CSS by Weft's Effect CSS engine.

## Install

Weft isn't on npm yet. Every commit to `main` is published to [pkg.pr.new](https://pkg.pr.new):

```bash
pnpm add effect@4.1.6 \
  https://pkg.pr.new/Effect-TS/ui/@effect/ui@9dc3482 \
  https://pkg.pr.new/Effect-TS/ui/@effect/ui-kit@9dc3482 \
  https://pkg.pr.new/kndwin/effect-ui-design-system/@weft/design-system@main
pnpm add -D vite@8 typescript \
  https://pkg.pr.new/kndwin/effect-ui-design-system/@weft/css-engine@main \
  https://pkg.pr.new/kndwin/effect-ui-design-system/@weft/cli@main
```

Then copy in components and start a theme:

```bash
pnpm weft add button dialog stack
pnpm weft theme shadcn --name brand
```

[Get started](https://weft-docs.kndwin.workers.dev/get-started) covers the Vite and TypeScript setup.

## Packages

| package               | what it is                                                   |
| :-------------------- | :----------------------------------------------------------- |
| `@weft/design-system` | token kinds, `Theme`, `Variant` and `Style`                  |
| `@weft/css-engine`    | the Vite plugin that compiles styles to CSS at build time    |
| `@weft/cli`           | `weft add` and `weft theme`                                  |
| `@weft/components`    | the components as source, which `weft add` copies from       |
| `@weft/theme-*`       | the shadcn and astryx themes, which `weft theme` starts from |

## Develop

`@effect/ui` is a git submodule at `vendor/effect-ui`. Scripts run on Bun, which is installed as a dev dependency.

```bash
git clone --recurse-submodules https://github.com/kndwin/effect-ui-design-system
pnpm install
pnpm docs   # the docs app
pnpm ci     # format, lint, typecheck, test and build
```

- Conventions are `+rule/<rule>/` folders whose docs run as tests.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/), checked by a pre-push hook.
- Pushing a `v*` tag deploys the docs to Cloudflare. That needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
- Each push to `main` and each pull request publishes the packages to pkg.pr.new.
