import { Rule, RuleContext } from "effect-oxlint"
import { assert, describe, it } from "@effect/vitest"
import * as RuleModule from "./rule-module.make.ts"

describe("RuleModule.make", () => {
  it("keeps the module's url with its rules", () => {
    // Arrange
    const rule = Rule.define({
      name: "x",
      meta: Rule.meta({ type: "problem", description: "x" }),
      create: function* () {
        yield* RuleContext
        return {}
      }
    })
    // Act
    const module = RuleModule.make("file:///repo/+rule/x/x.lint.ts", { x: rule })
    // Assert
    assert.strictEqual(module.url, "file:///repo/+rule/x/x.lint.ts")
    assert.deepStrictEqual(Object.keys(module.rules), ["x"])
  })
})
