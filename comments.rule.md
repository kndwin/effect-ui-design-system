# rule: no comments

Source files have **no comments**: not `//`, not `/* */`, not JSDoc.

- Explain with names: a well-named function or type says what a comment would.
- The _why_ of a convention belongs in its `*.rule.md`. Design notes belong in the README.
- This covers lint-disable comments too, so a check can't be switched off in place.

The one exception is `// @ts-expect-error` in type tests (`*.test-d.ts`), where the comment
is the assertion.

Checked twice: by ast-grep (`comments.rule.yml`) and oxlint (`comments.rule.ts`). An
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
