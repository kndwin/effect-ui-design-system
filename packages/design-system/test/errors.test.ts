import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Kit from "../src/platform/kit/kit.make.ts"
import * as Manifest from "../src/platform/manifest/manifest.make.ts"
import * as Style from "../src/feature/style/style.make.ts"
import { getStyleClasses } from "../src/feature/style/style.pure.ts"
import { mapSlotRuleToSelectors } from "../src/feature/style/style.pure.map.ts"
import * as Theme from "../src/feature/theme/theme.make.ts"
import * as TokenColor from "../src/platform/token/token-color.make.ts"

const failure = <E>(f: () => unknown) => Effect.try({ try: f, catch: (e) => e as E }).pipe(Effect.flip)

const Colors = TokenColor.make("color", ["accent", "fg"])

describe("typed errors", () => {
  it.effect("Theme.make fails with InvalidTokensError naming each bad path", () =>
    Effect.gen(function* () {
      // Arrange
      const values = { Colors: { accent: "purple", fg: "#000" } }
      // Act
      const error = yield* failure<Theme.InvalidTokensError>(() => Theme.make({ Colors }, { name: "bad", values }))
      // Assert
      assert.instanceOf(error, Theme.InvalidTokensError)
      assert.strictEqual(error.theme, "bad")
      assert.match(error.message, /^Theme "bad" has invalid token values:\n[\s\S]*\["Colors"\]\["accent"\]/)
    })
  )
  it.effect("Manifest.make fails with DuplicatePrefixError when groups share a prefix", () =>
    Effect.gen(function* () {
      // Arrange
      const tokens = { Colors, Other: TokenColor.make("color", ["x"]) }
      // Act
      const error = yield* failure<Manifest.DuplicatePrefixError>(() => Manifest.make({ tokens, styles: [] }))
      // Assert
      assert.instanceOf(error, Manifest.DuplicatePrefixError)
      assert.deepStrictEqual(error.groups, ["Colors", "Other"])
    })
  )
  it.effect("Style.classes fails with UncompiledStyleError outside the CSS engine", () =>
    Effect.gen(function* () {
      // Arrange
      const CardStyle = Style.make(Kit.makeSingle("Card"))({ base: { root: { color: Colors.fg } } })
      // Act
      const error = yield* failure<Style.UncompiledStyleError>(() => getStyleClasses({ style: CardStyle, props: {} }))
      // Assert
      assert.instanceOf(error, Style.UncompiledStyleError)
      assert.strictEqual(error.kit, "Card")
    })
  )
  it.effect("selectorsOf fails with UnknownStateError on a state the part doesn't have", () =>
    Effect.gen(function* () {
      // Arrange
      const rule = { states: { open: { opacity: 1 } } }
      // Act
      const error = yield* failure<Style.UnknownStateError>(() => mapSlotRuleToSelectors({ rule, partStates: {} }))
      // Assert
      assert.instanceOf(error, Style.UnknownStateError)
      assert.strictEqual(error.state, "open")
    })
  )
})
