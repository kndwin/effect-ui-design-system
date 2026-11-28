import { assert, describe, it } from "@effect/vitest"
import { mapMessageToLabel, mapTimeToLabel } from "./timeline.pure.map.ts"

describe("mapMessageToLabel", () => {
  it("shows a tagged message with no fields as its tag", () => {
    // Arrange
    const message = { _tag: "RequestedOpen" }
    // Act
    const label = mapMessageToLabel({ message })
    // Assert
    assert.deepStrictEqual(label, { tag: "RequestedOpen", payload: "" })
  })

  it("shows a single field as its value", () => {
    // Arrange
    const message = { _tag: "PickedValue", value: "pear" }
    // Act
    const label = mapMessageToLabel({ message })
    // Assert
    assert.deepStrictEqual(label, { tag: "PickedValue", payload: '"pear"' })
  })

  it("shows several fields as an object", () => {
    // Arrange
    const message = { _tag: "Moved", x: 1, y: 2 }
    // Act
    const label = mapMessageToLabel({ message })
    // Assert
    assert.deepStrictEqual(label, { tag: "Moved", payload: '{"x":1,"y":2}' })
  })
})

describe("mapTimeToLabel", () => {
  it("formats milliseconds as minutes and seconds", () => {
    // Arrange
    const at = 1200
    // Act
    const label = mapTimeToLabel({ at })
    // Assert
    assert.strictEqual(label, "0:01.200")
  })
})
