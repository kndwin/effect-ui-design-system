# rule: build files

A `*.build.ts` file is **build-time Node code**: the Vite plugin and the Effect program that
compiles style data into CSS. It never ships to the browser.

- It may use `node:*`, the file system and Vite's server APIs.
- It stays generic: no tokens, kits or Effect UI. Those arrive through the **adapter**, a module
  whose `compile(value, exportName)` returns an `Output` (`src/rules.pure.ts`). The design
  system's adapter is `@weft/design-system/Compile`.
- Logic that can be pure goes in a `*.pure.ts` with its test: serialising rules (`css.pure.ts`),
  class names (`hash.pure.ts`), recipes (`recipe.pure.ts`), the browser runtime (`runtime.pure.ts`)
  and code generation (`codegen.pure.ts`). The `.build.ts` files only load modules and wire Vite.
