import { assert, describe, it } from "@effect/vitest"
import { composePatch, getControls } from "./controls.pure.ts"

describe("getControls", () => {
  it("picks a control for each arg from its value", () => {
    // Arrange
    const args = JSON.stringify({ label: "Fruit", code: "a\nb", value: null, disabled: false, size: 2, items: [1] })
    // Act
    const controls = getControls({ args })
    // Assert
    assert.deepStrictEqual(
      controls.map((control) => [control.name, control.kind]),
      [
        ["label", "text"],
        ["code", "multiline"],
        ["value", "text"],
        ["disabled", "boolean"],
        ["size", "number"],
        ["items", "json"]
      ]
    )
  })

  it("has no controls before the args arrive", () => {
    // Arrange
    const args = ""
    // Act
    const controls = getControls({ args })
    // Assert
    assert.deepStrictEqual(controls, [])
  })
})

describe("composePatch", () => {
  it("turns an edited control back into an args patch", () => {
    // Arrange
    const edits = [
      { name: "disabled", kind: "boolean" as const, value: "true" },
      { name: "label", kind: "text" as const, value: "Fruit" }
    ]
    // Act
    const patches = edits.map(composePatch)
    // Assert
    assert.deepStrictEqual(patches, ['{"disabled":true}', '{"label":"Fruit"}'])
  })
})
