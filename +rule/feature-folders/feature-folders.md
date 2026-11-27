# rule: feature and platform folders

Every package with real code (`components`, `design-system`, `css-engine`), every app and every
tool (`tools/lint`) has the same `src/` layout, after [Bulletproof React](https://github.com/alan2207/bulletproof-react),
adapted to `@effect/ui`:

```
src/
  main.ts                 apps only: mount the root with its Layers
  feature/<name>/         one capability: a page, a component, a tool
  platform/<name>/        what features stand on, and what puts them together
```

- **feature/** holds one self-contained capability. In the docs app that's a page
  (`feature/component-docs`: route and view) or a panel (`feature/theme-builder`). In
  `@acme/components` it's a component (`feature/code-block`).
- **platform/** holds what several features share (`platform/theme`, `platform/token`,
  `platform/scale`), the runtime (`platform/engine`, `platform/vite`), and composition, which is
  allowed to import features (`platform/app`, `platform/manifest`, `platform/compile`).
- **A feature never imports another feature.** If two features need the same thing, it moves to
  `platform/`. If something needs to put features together, it lives in `platform/`.

Imports go one way: `platform/<shared>` ← `feature/*` ← `platform/<composition>`. Theme packages
(a single `*.theme.ts`) are exempt.

## ✅ a feature using the platform

```ts good path=packages/__rules__/src/feature/greet/greet.pure.ts
import type { GetGreetingInput } from "../../platform/text/text.schema.ts"

export const getGreeting = ({ name }: GetGreetingInput) => `Hello, ${name}`
```

## ❌ a file outside feature/ and platform/ → feature-folders/layout

```ts bad path=packages/__rules__/src/loose.constant.ts
export const loose = 1
```

## ❌ a feature importing another → feature-folders/no-cross-feature-imports

```ts bad path=packages/__rules__/src/feature/farewell/farewell.pure.ts
import { getGreeting } from "../greet/greet.pure.ts"
import type { GetFarewellInput } from "./farewell.schema.ts"

export const getFarewell = ({ name }: GetFarewellInput) => `${getGreeting({ name })}, and goodbye`
```
