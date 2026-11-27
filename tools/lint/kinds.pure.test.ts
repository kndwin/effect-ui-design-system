import { describe, expect, it } from "vitest"
import { docPath, inScope, isGoverned, kindOf, ruleKindOf, scopeOf } from "./kinds.pure.ts"

describe("kinds", () => {
  it("matches the most specific suffix first", () => {
    // Arrange
    const files = ["a.component.style.ts", "a.component.ts", "a.pure.test.ts", "a.pure.ts", "main.ts", "a.ts"]
    // Act
    const kinds = files.map((f) => {
      const k = kindOf(f)
      return k === undefined ? undefined : "name" in k ? k.name : k.suffix
    })
    // Assert
    expect(kinds).toEqual([".component.style.ts", ".component.ts", ".pure.test.ts", ".pure.ts", "main.ts", undefined])
  })

  it("governs src and test folders of packages and apps", () => {
    // Arrange
    const paths = ["packages/a/src/x.ts", "packages/themes/b/src/x.ts", "apps/docs/test/x.ts", "tools/lint/x.ts"]
    // Act
    const governed = paths.map(isGoverned)
    // Assert
    expect(governed).toEqual([true, true, true, false])
  })

  it("reads a rule's kind and scope from its +rule folder", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component.style/component.style.lint.ts"
    // Act
    const kind = ruleKindOf(ruleFile)
    const scope = scopeOf(ruleFile)
    // Assert
    expect(kind).toBe("component.style")
    expect(scope).toBe("/repo/packages/components")
    expect(docPath(scope, kind)).toBe("/repo/packages/components/+rule/component.style/component.style.md")
  })

  it("covers files of the rule's kind under its folder only", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component.style/component.style.yml"
    // Act
    const results = [
      "/repo/packages/components/src/button/button.component.style.ts",
      "/repo/packages/components/src/button/button.component.ts",
      "/repo/packages/themes/x.component.style.ts"
    ].map((f) => inScope(ruleFile, f))
    // Assert
    expect(results).toEqual([true, false, false])
  })
})
