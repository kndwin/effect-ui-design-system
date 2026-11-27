# rule: tests

Every test is written in three marked steps, in this order:

```ts
it("doubles", () => {
  // Arrange
  const n = 2
  // Act
  const result = double(n)
  // Assert
  assert.strictEqual(result, 4)
})
```

- Tests import `describe`, `it`, `assert` and `layer` from `@effect/vitest`, never `vitest`. Use
  `it.effect` for anything that runs an Effect, `layer(...)` to share services across tests, and
  `assert` over `expect`.

- These three comments are the only comments allowed outside `@ts-expect-error`
  (`+rule/comments/comments.md`), and only in `*.test.ts` files.
- Every `*.pure.ts` has a `*.pure.test.ts` next to it (`+rule/pure/pure.md`). Other tests live in
  the package's `test/` folder.
- One behaviour per test. If the Act step does two things, split the test.

## ✅

```ts good
import { assert, it } from "@effect/vitest"

it("adds", () => {
  // Arrange
  const a = 1
  // Act
  const sum = a + 1
  // Assert
  assert.strictEqual(sum, 2)
})
```

## ✅ an Effect

```ts good
import { assert, it } from "@effect/vitest"
import { Effect } from "effect"

it.effect("succeeds", () =>
  Effect.gen(function* () {
    // Arrange
    const program = Effect.succeed(2)
    // Act
    const n = yield* program
    // Assert
    assert.strictEqual(n, 2)
  })
)
```

## ❌ imports vitest → test/imports

```ts bad
import { assert, it } from "vitest"

it("adds", () => {
  // Arrange
  const a = 1
  // Act
  const sum = a + 1
  // Assert
  assert.strictEqual(sum, 2)
})
```

## ❌ no steps → test/arrange-act-assert

```ts bad
import { assert, it } from "@effect/vitest"

it("adds", () => {
  assert.strictEqual(1 + 1, 2)
})
```

## ❌ steps out of order → test/arrange-act-assert

```ts bad
import { assert, it } from "@effect/vitest"

it("adds", () => {
  // Act
  const sum = 1 + 1
  // Arrange
  // Assert
  assert.strictEqual(sum, 2)
})
```
