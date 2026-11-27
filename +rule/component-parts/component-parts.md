# rule: component parts

A stateful `@effect/ui` component is split by concern, one file kind each. `Component.define`
(or `Html.component`) makes a definition, and the definition types every other part, so each
file is small and checked on its own.

| file                | holds                                                                | built with                                                | named                  |
| :------------------ | :------------------------------------------------------------------- | :-------------------------------------------------------- | :--------------------- |
| `x.schema.ts`       | props, model, message and events Schemas                             | `Schema.Struct`, `UiSchema.TaggedEnum`                    | `…Schema`              |
| `x.define.ts`       | the definition, nothing else                                         | `Html.component({ name, props, model, message, events })` | `XDef`                 |
| `x.update.ts`       | how the model changes, per message                                   | `XDef.update({ … })` or `XDef.update(tag, f)` slices      | `update`, `handle…`    |
| `x.view.ts`         | the view and its fragments                                           | `XDef.view(f)`, `XDef.fragment(f)`                        | `view`, `head`, Pascal |
| `x.command.ts`      | the only place effects run                                           | `Command.make`, `Command.Service`                         | PascalCase             |
| `x.subscription.ts` | Router changes, timers, outside events                               | `XDef.subscriptions(f)`                                   | `subscriptions`        |
| `x.route.ts`        | the feature's URLs                                                   | `Route.make(path, { params, search })`, `Route.union`     | `…Route`               |
| `x.component.ts`    | the wiring: `XDef.make({ init, update, view, subscriptions, head })` |                                                           | PascalCase             |

- Effects never run in `update` or `view`: they return Commands, which `$.run(...)` hands to the
  runtime. Commands are defined only in `*.command.ts`.
- `update`, `view` and `route` files are data modules (`+rule/pure-files/pure-files.md`).
- A page with no state of its own is just a view: `x.route.ts` plus `x.view.ts` exporting
  `XPage(h, …)`.

## ✅ a Command in its own file

```ts good path=packages/__rules__/src/feature/copy/copy.command.ts
import { Command } from "@effect/ui"
import { Effect } from "effect"

export const CopyText = Command.make("weft/Copy", { args: {} }, () => Effect.void)
```

## ✅ an update that runs a Command

```ts good path=packages/__rules__/src/feature/copy/copy.update.ts
import { CopyText } from "./copy.command.ts"
import { CopyDef } from "./copy.define.ts"

export const update = CopyDef.update({ Pressed: ($) => $.run(CopyText.make({})) })
```

## ❌ a Command defined in an update → component-parts/commands-in-command-files

```ts bad path=packages/__rules__/src/feature/copy/paste.update.ts
import { Command } from "@effect/ui"
import { Effect } from "effect"
import { CopyDef } from "./copy.define.ts"

const Paste = Command.make("weft/Paste", { args: {} }, () => Effect.void)
export const update = CopyDef.update({ Pressed: ($) => $.run(Paste.make({})) })
```

## ❌ a definition without the Def suffix → function-names/prefix

```ts bad path=packages/__rules__/src/feature/copy/copy.define.ts
import { Html } from "@effect/ui/html"

export const Copy = Html.component({ name: "Copy" })
```
