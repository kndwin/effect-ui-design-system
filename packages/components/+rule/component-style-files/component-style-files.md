# rule: component style files

A `*.component.style.ts` file **declares how a component looks, as data**. Each export is one
`Style.make(Kit)({ base, variants, compound })`. `@weft/css-engine` compiles it to static CSS at
build time, and importers get class names. It is a data file, so `+rule/pure-files/pure-files.md` applies too.

**Values are tokens.** Colours, lengths, durations, shadows, fonts and weights come from the
contract (`Colors.accent`, `Spacing[4]`, `Radius.control`), or are derived from it
(`TokenColor.makeAlpha(…)`, ``TokenLength.makeCalc`…` ``). Keywords are fine: `display`, `cursor`,
`"100%"`, `"auto"`, `0`, unitless line-heights. No raw `#hex`, `rgb()`, `oklch()`, `12px`,
`1rem` or `150ms`.

**Need a token that doesn't exist? Stop and ask.** Don't add one to `contract.token.ts`, and
don't hard-code a value.

The compiler checks the rest: slot names and `states` come from the kit, and every value of a
variant's Schema must be styled.

## ✅

```ts good
import * as Style from "@weft/design-system/Style"
import { Button } from "@weft/design-system/kit/button"
import { Colors, Radius } from "./contract.token.ts"

export const ButtonStyle = Style.make(Button)({
  base: { root: { background: Colors.accent, borderRadius: Radius.control, display: "inline-flex" } }
})
```

## ❌ raw value → component-style-files/tokens-only

```ts bad
import * as Style from "@weft/design-system/Style"
import { Button } from "@weft/design-system/kit/button"

export const ButtonStyle = Style.make(Button)({ base: { root: { background: "#7c5cff" } } })
```

## ❌ not a Style.make export → component-style-files/exports

```ts bad
export const double = (n: number) => n * 2
```

## ❌ a non-@weft import → component-style-files/imports

```ts bad
import { readFileSync } from "node:fs"
export const source = readFileSync
```
