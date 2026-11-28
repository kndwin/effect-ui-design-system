import { assert, describe, it } from "@effect/vitest"
import { Option } from "effect"
import { getClipRows, getCurrentClip, getDuration, getSeqAt, getSteppedAt, getTicks } from "./timeline.pure.ts"

const clip = (seq: number, at: number) => ({ seq, at, tag: "Tag", payload: "", model: "{}", args: "{}" })
const clips = [clip(41, 1000), clip(42, 1400), clip(44, 1800)]

describe("getSeqAt", () => {
  it("paints everything up to the next message after the time", () => {
    // Arrange
    const at = 500
    // Act
    const seq = getSeqAt({ clips, at })
    // Assert
    assert.strictEqual(seq, 43)
  })

  it("paints everything after the last message", () => {
    // Arrange
    const at = 900
    // Act
    const seq = getSeqAt({ clips, at })
    // Assert
    assert.strictEqual(seq, Number.MAX_SAFE_INTEGER)
  })

  it("is the entry before the first message when the time is before it", () => {
    // Arrange
    const at = -1
    // Act
    const seq = getSeqAt({ clips, at })
    // Assert
    assert.strictEqual(seq, 40)
  })
})

describe("getSteppedAt", () => {
  it("steps forward to the next message", () => {
    // Arrange
    const at = 400
    // Act
    const next = getSteppedAt({ clips, at, direction: "forward" })
    // Assert
    assert.strictEqual(next, 800)
  })

  it("steps back to the previous message", () => {
    // Arrange
    const at = 400
    // Act
    const previous = getSteppedAt({ clips, at, direction: "back" })
    // Assert
    assert.strictEqual(previous, 0)
  })
})

describe("getCurrentClip", () => {
  it("is the last message when the playhead follows the end", () => {
    // Arrange
    const at = null
    // Act
    const current = getCurrentClip({ clips, at })
    // Assert
    assert.deepStrictEqual(
      Option.map(current, (c) => c.seq),
      Option.some(44)
    )
  })
})

describe("getDuration", () => {
  it("leaves room after the last message", () => {
    // Arrange
    const long = [clip(1, 0), clip(2, 3000)]
    // Act
    const duration = getDuration({ clips: long })
    // Assert
    assert.strictEqual(duration, 3600)
  })
})

describe("getTicks", () => {
  it("marks every 500ms as major", () => {
    // Arrange
    const duration = 1000
    // Act
    const ticks = getTicks({ duration })
    // Assert
    assert.deepStrictEqual(
      ticks.filter((tick) => tick.major).map((tick) => tick.at),
      [0, 500, 1000]
    )
  })
})

describe("getClipRows", () => {
  it("moves a message that lands with the one before it to the other row", () => {
    // Arrange
    const together = [clip(1, 0), clip(2, 400), clip(3, 401), clip(4, 800)]
    // Act
    const rows = getClipRows({ clips: together })
    // Assert
    assert.deepStrictEqual(rows, [0, 0, 1, 0])
  })
})
