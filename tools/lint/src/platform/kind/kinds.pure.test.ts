import { assert, describe, it } from "@effect/vitest"
import { getKebabProblem, getFileKind, getRuleSuffixes } from "./kinds.pure.ts"
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
