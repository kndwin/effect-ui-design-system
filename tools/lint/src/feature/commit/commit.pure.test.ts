import { assert, describe, it } from "@effect/vitest"
import { getPushRanges } from "./commit.pure.ts"

describe("getPushRanges", () => {
  it("checks new commits on an updated ref and every unpushed commit on a new ref", () => {
    // Arrange
    const input = [
      "refs/heads/main 2222222 refs/heads/main 1111111",
      "refs/heads/next 3333333 refs/heads/next 0000000"
    ].join("\n")
    // Act
    const ranges = getPushRanges({ input })
    // Assert
    assert.deepStrictEqual(ranges, [["1111111..2222222"], ["3333333", "--not", "--remotes"]])
  })

  it("skips a deleted ref and empty input", () => {
    // Arrange
    const input = "(delete) 0000000 refs/heads/old 1111111\n"
    // Act
    const ranges = getPushRanges({ input })
    // Assert
    assert.deepStrictEqual(ranges, [])
  })
})
