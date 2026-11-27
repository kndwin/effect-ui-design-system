# rule: build files

A `*.build.ts` file is **build-time Node code**: the Vite plugin and the code that writes CSS.
It never ships to the browser.

- It may use `node:*` and the file system.
- It is the only kind that may import `@vanilla-extract/*` (checked by `file-kind.rule.ts`).
  vanilla-extract is how `@acme/css-engine` writes CSS today, and nothing else should know it.
- It stays generic: no tokens, kits or Effect UI. Those arrive through the **adapter**, a module
  whose `compile(value, exportName)` returns an `Output` (`src/rules.pure.ts`). The design
  system's adapter is `@acme/ds/Compile`.
- The engine's input contract stays in `rules.pure.ts`: plain data, no functions.
