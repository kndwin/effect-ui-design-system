import { assert, describe, it } from "@effect/vitest"
import { render, styled } from "./element.pure.ts"

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
    assert.deepStrictEqual(out.added, ["Stack_root__x", "extra"])
  })
})

describe("styled", () => {
  it("applies a compiled style's root classes for the given props, then the caller's", () => {
    // Arrange
    const style = {
      kit: "Box" as const,
      variants: { pad: { values: ["sm", "lg"], default: "sm" } },
      slots: { root: (p?: Readonly<Record<string, unknown>>) => `Box_root Box_pad_${String(p?.["pad"] ?? "sm")}` }
    }
    const Box = styled<"Box", { readonly pad?: "sm" | "lg" }>(style)
    element.added.length = 0
    // Act
    const out = Box(element, { pad: "lg", class: "extra" })
    // Assert
    assert.deepStrictEqual(out.added, ["Box_root Box_pad_lg", "extra"])
  })
})
