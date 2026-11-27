# rule: tests

Every test is written in three marked steps, in this order:

```ts
it("doubles", () => {
  // Arrange
  const n = 2
  // Act
  const result = double(n)
  // Assert
  expect(result).toBe(4)
})
```

- These three comments are the only comments allowed outside `@ts-expect-error`
  (`+rule/comments/comments.md`), and only in `*.test.ts` files.
- Every `*.pure.ts` has a `*.pure.test.ts` next to it (`+rule/pure/pure.md`). Other tests live in
  the package's `test/` folder.
- One behaviour per test. If the Act step does two things, split the test.

## ✅

```ts good
import { expect, it } from "vitest"

it("adds", () => {
  // Arrange
  const a = 1
  // Act
  const sum = a + 1
  // Assert
  expect(sum).toBe(2)
})
```

## ❌ no steps → test/arrange-act-assert

```ts bad
import { expect, it } from "vitest"

it("adds", () => {
  expect(1 + 1).toBe(2)
})
```

## ❌ steps out of order → test/arrange-act-assert

```ts bad
import { expect, it } from "vitest"

it("adds", () => {
  // Act
  const sum = 1 + 1
  // Arrange
  // Assert
  expect(sum).toBe(2)
})
```
