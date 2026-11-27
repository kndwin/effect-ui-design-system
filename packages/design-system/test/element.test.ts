import { assert, describe, it } from "@effect/vitest"
import { make } from "../src/element/element.make.ts"

const element = {
  added: [] as Array<string | false | null | undefined>,
  class(...tokens: ReadonlyArray<string | false | null | undefined>) {
    this.added.push(...tokens)
    return this
  }
}

describe("make", () => {
  it("applies a compiled style's root classes for the given props, then the caller's", () => {
    // Arrange
    const style = {
      kit: "Box" as const,
      variants: { pad: { values: ["sm", "lg"], default: "sm" } },
      slots: { root: (p?: Readonly<Record<string, unknown>>) => `Box_root Box_pad_${String(p?.["pad"] ?? "sm")}` }
    }
    const Box = make<"Box", { readonly pad?: "sm" | "lg" }>(style)
    element.added.length = 0
    // Act
    const out = Box(element, { pad: "lg", class: "extra" })
    // Assert
    assert.deepStrictEqual(out.added, ["Box_root Box_pad_lg", "extra"])
  })
})
