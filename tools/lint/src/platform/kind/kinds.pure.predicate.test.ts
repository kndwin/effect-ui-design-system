import { assert, describe, it } from "@effect/vitest"
import { isGoverned, isInScope } from "./kinds.pure.predicate.ts"
describe("kinds predicates", () => {
  it("governs src and test folders of packages and apps", () => {
    // Arrange
    const paths = ["packages/a/src/x.ts", "packages/themes/b/src/x.ts", "apps/docs/test/x.ts", "tools/lint/x.ts"]
    // Act
    const governed = paths.map((path) => isGoverned({ path }))
    // Assert
    assert.deepStrictEqual(governed, [true, true, true, false])
  })

  it("covers files of the rule's kind under its folder only", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component-style-files/component-style-files.yml"
    // Act
    const results = [
      "/repo/packages/components/src/button/button.component.style.ts",
      "/repo/packages/components/src/button/button.component.ts",
      "/repo/packages/themes/x.component.style.ts"
    ].map((f) => isInScope({ ruleFile: ruleFile, file: f }))
    // Assert
    assert.deepStrictEqual(results, [true, false, false])
  })
})
