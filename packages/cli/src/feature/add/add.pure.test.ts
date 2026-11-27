import { assert, describe, it } from "@effect/vitest"
import { Option } from "effect"
import { getComponentNames, getComponentPath } from "./add.pure.ts"

const exports = {
  "./button": "./src/platform/button/button.component.ts",
  "./layout/stack": "./src/feature/layout/stack.component.ts",
  "./tokens": "./src/platform/token/contract.token.ts"
}

describe("getComponentNames", () => {
  it("lists components by their short names, sorted", () => {
    // Arrange
    const input = { exports }
    // Act
    const names = getComponentNames(input)
    // Assert
    assert.deepStrictEqual(names, ["button", "stack"])
  })
})

describe("getComponentPath", () => {
  it("finds a component by its short or full name", () => {
    // Arrange
    const names = ["stack", "layout/stack"]
    // Act
    const paths = names.map((name) => getComponentPath({ exports, name }))
    // Assert
    assert.deepStrictEqual(paths, [
      Option.some("src/feature/layout/stack.component.ts"),
      Option.some("src/feature/layout/stack.component.ts")
    ])
  })

  it("finds nothing for a module that isn't a component", () => {
    // Arrange
    const name = "tokens"
    // Act
    const path = getComponentPath({ exports, name })
    // Assert
    assert.deepStrictEqual(path, Option.none())
  })
})
