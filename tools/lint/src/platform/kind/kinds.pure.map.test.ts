import { assert, describe, it } from "@effect/vitest"
import { mapRuleFileToRuleKind, mapRuleFileToScope, mapRuleKindToDocPath } from "./kinds.pure.map.ts"
describe("kinds mappers", () => {
  it("reads a rule's kind and scope from its +rule folder", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component-style-files/component-style-files.lint.ts"
    // Act
    const kind = mapRuleFileToRuleKind({ ruleFile: ruleFile })
    const scope = mapRuleFileToScope({ ruleFile: ruleFile })
    // Assert
    assert.strictEqual(kind, "component-style-files")
    assert.strictEqual(scope, "/repo/packages/components")
    assert.strictEqual(
      mapRuleKindToDocPath({ dir: scope, kind: kind }),
      "/repo/packages/components/+rule/component-style-files/component-style-files.md"
    )
  })
})
