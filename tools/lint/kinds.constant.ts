import { Match } from "effect"
export const kinds: Readonly<Record<string, ReadonlyArray<string>>> = {
  "allowed-file-kinds": [".ts"],
  "no-comments": [".ts"],
  "no-ternary": [".ts"],
  "types-from-schema": [".ts"],
  "pure-files": [".pure.ts", ".make.ts", ".schema.ts", ".constant.ts", ".component.style.ts", ".token.ts", ".theme.ts"],
  "make-files": [".make.ts"],
  "schema-files": [".schema.ts"],
  "constant-files": [".constant.ts"],
  "test-files": [".test.ts"],
  "component-files": [".component.ts"],
  "component-style-files": [".component.style.ts"],
  "token-files": [".token.ts"],
  "theme-files": [".theme.ts"],
  "build-files": [".build.ts"]
}

export const fileKinds = [
  { suffix: ".component.style.ts", doc: "component-style-files" },
  { suffix: ".component.ts", doc: "component-files" },
  { suffix: ".token.ts", doc: "token-files" },
  { suffix: ".theme.ts", doc: "theme-files" },
  { suffix: ".make.ts", doc: "make-files" },
  { suffix: ".schema.ts", doc: "schema-files" },
  { suffix: ".constant.ts", doc: "constant-files" },
  { suffix: ".pure.test.ts", doc: "test-files", colocated: true },
  { suffix: ".pure.ts", doc: "pure-files" },
  { suffix: ".build.ts", doc: "build-files" },
  { suffix: ".d.ts" },
  { suffix: ".test.ts", doc: "test-files", test: true },
  { suffix: ".test-d.ts", test: true },
  { suffix: ".fixture.ts", test: true },
  { name: "main.ts" }
] as const

export type FileKind = (typeof fileKinds)[number]

export const allowed = fileKinds
  .map((k) =>
    Match.value<FileKind>(k).pipe(
      Match.when({ name: Match.string }, (named) => named.name),
      Match.orElse((suffixed) => `*${suffixed.suffix}`)
    )
  )
  .join(", ")
