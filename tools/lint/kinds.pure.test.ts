import { assert, describe, it } from "@effect/vitest"
import { docPath, inScope, isGoverned, kebabProblem, kindOf, ruleKindOf, scopeOf } from "./kinds.pure.ts"

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
    assert.deepStrictEqual(kinds, [
      ".component.style.ts",
      ".component.ts",
      ".pure.test.ts",
      ".pure.ts",
      "main.ts",
      undefined
    ])
  })

  it("governs src and test folders of packages and apps", () => {
    // Arrange
    const paths = ["packages/a/src/x.ts", "packages/themes/b/src/x.ts", "apps/docs/test/x.ts", "tools/lint/x.ts"]
    // Act
    const governed = paths.map(isGoverned)
    // Assert
    assert.deepStrictEqual(governed, [true, true, true, false])
  })

  it("reads a rule's kind and scope from its +rule folder", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component.style/component.style.lint.ts"
    // Act
    const kind = ruleKindOf(ruleFile)
    const scope = scopeOf(ruleFile)
    // Assert
    assert.strictEqual(kind, "component.style")
    assert.strictEqual(scope, "/repo/packages/components")
    assert.strictEqual(docPath(scope, kind), "/repo/packages/components/+rule/component.style/component.style.md")
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
    assert.deepStrictEqual(results, [true, false, false])
  })

  it("names the first path segment that isn't kebab-case", () => {
    // Arrange
    const paths = [
      "apps/docs/src/docs.component.ts",
      "apps/docs/src/Docs.component.ts",
      "packages/components/src/code-block/code-block.parts.constant.ts",
      "packages/components/src/codeBlock/x.pure.ts",
      "tools/lint/Any.ts"
    ]
    // Act
    const problems = paths.map(kebabProblem)
    // Assert
    assert.deepStrictEqual(problems, [undefined, "Docs", undefined, "codeBlock", undefined])
  })
})
