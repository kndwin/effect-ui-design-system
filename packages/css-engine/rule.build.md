# rule: `*.build.ts`

A `.build.ts` file is **build-time Node code**: the Vite plugin and the code that writes CSS.
It never ships to the browser.

- It may use `node:*` and touch the file system.
- It is the only kind that may import `@vanilla-extract/*` (lint: `acme/vanilla-imports`).
  vanilla-extract is how `@acme/css-engine` writes CSS today. Nothing else should know that.
- It stays generic. No tokens, kits or Effect UI: those arrive through the **adapter**, a module
  whose `compile(value, exportName)` returns `Output` (`src/rules.pure.ts`). The design system's
  adapter is `@acme/ds/Compile`.
- Keep the engine's input contract in `rules.pure.ts`: plain data, no functions.
