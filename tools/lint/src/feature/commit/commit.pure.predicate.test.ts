import { assert, describe, it } from "@effect/vitest"
import { isConventionalSubject } from "./commit.pure.predicate.ts"

describe("isConventionalSubject", () => {
  it("accepts a type, an optional scope and a breaking mark", () => {
    // Arrange
    const subjects = ["feat: add calendar", "fix(docs): load examples lazily", "refactor(lint)!: rename rules"]
    // Act
    const results = subjects.map((subject) => isConventionalSubject({ subject }))
    // Assert
    assert.deepStrictEqual(results, [true, true, true])
  })

  it("rejects a missing type, an unknown type and an empty description", () => {
    // Arrange
    const subjects = ["Add calendar", "feature: add calendar", "feat: ", "feat(Docs): add calendar"]
    // Act
    const results = subjects.map((subject) => isConventionalSubject({ subject }))
    // Assert
    assert.deepStrictEqual(results, [false, false, false, false])
  })
})
