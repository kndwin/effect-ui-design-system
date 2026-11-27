import { describe, expect, it } from "vitest"
import { render } from "./element.pure.ts"

const element = {
  added: [] as Array<string | false | null | undefined>,
  class(...tokens: ReadonlyArray<string | false | null | undefined>) {
    this.added.push(...tokens)
    return this
  }
}

describe("render", () => {
  it("adds the root class, then the caller's", () => {
    // Arrange
    const classes = { root: "Stack_root__x" }
    // Act
    const out = render(element, classes, "extra")
    // Assert
    expect(out.added).toEqual(["Stack_root__x", "extra"])
  })
})
