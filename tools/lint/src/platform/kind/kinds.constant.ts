import { Match } from "effect"
export const kinds: Readonly<Record<string, ReadonlyArray<string>>> = {
  "allowed-file-kinds": [".ts"],
  "no-comments": [".ts"],
  "no-ternary": [".ts"],
  "types-from-schema": [".ts"],
  "function-names": [
    ".pure.ts",
    ".pure.map.ts",
    ".pure.predicate.ts",
    ".make.ts",
    ".build.ts",
    ".component.ts",
    ".schema.ts",
    ".define.ts",
    ".update.ts",
    ".view.ts",
    ".command.ts",
    ".subscription.ts",
    ".route.ts"
  ],
  "component-parts": [
    ".define.ts",
    ".update.ts",
    ".view.ts",
    ".command.ts",
    ".subscription.ts",
    ".route.ts",
    ".component.ts"
  ],
  "feature-folders": [".ts"],
  "pure-files": [
    ".pure.ts",
    ".pure.map.ts",
    ".pure.predicate.ts",
    ".make.ts",
    ".update.ts",
    ".view.ts",
    ".route.ts",
    ".schema.ts",
    ".constant.ts",
    ".component.style.ts",
    ".token.ts",
    ".theme.ts"
  ],
  "make-files": [".make.ts"],
  "loom-files": [".loom.ts"],
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
  { suffix: ".define.ts", doc: "component-parts" },
  { suffix: ".update.ts", doc: "component-parts" },
  { suffix: ".view.ts", doc: "component-parts" },
  { suffix: ".command.ts", doc: "component-parts" },
  { suffix: ".subscription.ts", doc: "component-parts" },
  { suffix: ".route.ts", doc: "component-parts" },
  { suffix: ".token.ts", doc: "token-files" },
  { suffix: ".theme.ts", doc: "theme-files" },
  { suffix: ".make.ts", doc: "make-files" },
  { suffix: ".loom.ts", doc: "loom-files" },
  { suffix: ".schema.ts", doc: "schema-files" },
  { suffix: ".constant.ts", doc: "constant-files" },
  { suffix: ".pure.map.test.ts", doc: "test-files", colocated: true },
  { suffix: ".pure.predicate.test.ts", doc: "test-files", colocated: true },
  { suffix: ".pure.test.ts", doc: "test-files", colocated: true },
  { suffix: ".pure.map.ts", doc: "pure-files" },
  { suffix: ".pure.predicate.ts", doc: "pure-files" },
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

export const skipped = /(^|\/)(node_modules|vendor|dist|\.git)\//
