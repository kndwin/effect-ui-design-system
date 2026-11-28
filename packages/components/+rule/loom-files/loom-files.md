# rule: loom files

A `*.loom.ts` file sits next to a component and gives it a **playground** and **scenarios** in
Loom (`apps/loom`). Its default export is one `Loom.make({ title, args, render, scenarios })`:

- `args` are the props the playground starts from.
- `render(h, args)` draws the component. A handler returns a partial args object, which Loom
  merges into the args, as a parent would.
- `scenarios` maps a name to a list of steps, or to `{ args, steps }`. A step is a message value
  (`SelectMessageSchema.RequestedOpen()`), sent to the instance whose message Schema accepts it,
  or a function `(root) => void` that drives the DOM with `HtmlLocator`.

Scenarios only compose messages. Loom shows each one's messages on a timeline you can scrub.
Loom files are dev-only: they're left out of the package build and `weft add` doesn't copy them.

## ✅

```ts good path=packages/components/src/feature/__rules__/toggle.loom.ts
import * as Loom from "@weft/loom/Loom"

export default Loom.make({
  title: "Toggle",
  args: { pressed: false },
  render: (h, args) => h.button.children(String(args.pressed)),
  scenarios: { "presses twice": [{ _tag: "Pressed" }, { _tag: "Pressed" }] }
})
```

## ❌ no Loom.make default export → loom-files/default-loom

```ts bad path=packages/components/src/feature/__rules__/untitled.loom.ts
export const scenarios = {}
```
