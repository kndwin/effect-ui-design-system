# rule: no comments

Source files have **no comments**: not `//`, not `/* */`, not JSDoc.

- Explain with names: a well-named function or type says what a comment would.
- The _why_ of a convention belongs in its `+rule/<rule>/<rule>.md`. Design notes belong in the README.
- This covers lint-disable comments too, so a check can't be switched off in place.

Two exceptions:

- `// @ts-expect-error` in type tests, where the comment is the assertion.
- `// Arrange`, `// Act`, `// Assert` in `*.test.ts` files (`+rule/test/test.md`).

Checked twice: by ast-grep (`comments.yml`) and oxlint (`comments.lint.ts`). An
`oxlint-disable` comment can't silence the ast-grep check, and it is itself a comment.

## ✅

```ts good
export const double = (n: number) => n * 2
```

## ✅ type-test assertion

```ts good
// @ts-expect-error
export const n: number = "not a number"
```

## ❌ test steps outside a test → comments/none

```ts bad
// Arrange
export const n = 1
```

## ❌ line comment → comments/none

```ts bad
// doubles a number
export const double = (n: number) => n * 2
```

## ❌ JSDoc → comments/none

```ts bad
/** Doubles a number. */
export const double = (n: number) => n * 2
```
