import { assert, describe, it } from "@effect/vitest"
import {
  getDocPath,
  isInScope,
  isGoverned,
  getKebabProblem,
  getFileKind,
  getRuleKind,
  getRuleScope,
  getRuleSuffixes
} from "./kinds.pure.ts"
import { Match } from "effect"

describe("kinds", () => {
  it("matches the most specific suffix first", () => {
    // Arrange
    const files = ["a.component.style.ts", "a.component.ts", "a.pure.test.ts", "a.pure.ts", "main.ts", "a.ts"]
    // Act
    const kinds = files.map((f) => {
      const k = getFileKind({ path: f })
      return Match.value(k).pipe(
        Match.when(undefined, () => undefined),
        Match.when({ name: Match.string }, (named) => named.name),
        Match.orElse((suffixed) => suffixed.suffix)
      )
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
    const governed = paths.map((path) => isGoverned({ path }))
    // Assert
    assert.deepStrictEqual(governed, [true, true, true, false])
  })

  it("reads a rule's kind and scope from its +rule folder", () => {
    // Arrange
    const ruleFile = "/repo/packages/components/+rule/component-style-files/component-style-files.lint.ts"
    // Act
    const kind = getRuleKind({ ruleFile: ruleFile })
    const scope = getRuleScope({ ruleFile: ruleFile })
    // Assert
    assert.strictEqual(kind, "component-style-files")
    assert.strictEqual(scope, "/repo/packages/components")
    assert.strictEqual(
      getDocPath({ dir: scope, kind: kind }),
      "/repo/packages/components/+rule/component-style-files/component-style-files.md"
    )
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
    const problems = paths.map((path) => getKebabProblem({ path }))
    // Assert
    assert.deepStrictEqual(problems, [undefined, "Docs", undefined, "codeBlock", undefined])
  })

  it("lists the file suffixes a rule covers", () => {
    // Arrange
    const ruleFile = "/repo/+rule/make-files/make-files.yml"
    // Act
    const suffixes = getRuleSuffixes({ ruleFile })
    // Assert
    assert.deepStrictEqual(suffixes, [".make.ts"])
  })
})
