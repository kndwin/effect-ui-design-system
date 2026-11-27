// The file kinds allowed under packages/*/src, packages/themes/*/src, apps/*/src and test/.
// Each kind with a `doc` must have that rule file in the same folder or an ancestor.
export const fileKinds = [
  {
    suffix: ".component.style.ts",
    doc: "rule.component.style.md",
    what: "Style.make(...) exports only; data, tokens only"
  },
  { suffix: ".component.ts", doc: "rule.component.md", what: "exports UI: an Html.component or a view function" },
  { suffix: ".token.ts", doc: "rule.token.md", what: "the token contract: Token*.make(...) exports only" },
  { suffix: ".theme.ts", doc: "rule.theme.md", what: "Theme.make(...) exports only" },
  { suffix: ".pure.ts", doc: "rule.pure.md", what: "pure functions and data" },
  { suffix: ".d.ts", what: "type declarations" },
  { suffix: ".test.ts", what: "tests (test/ only)" },
  { suffix: ".test-d.ts", what: "type tests (test/ only)" },
  { name: "main.ts", what: "app entry (apps/* only)" }
] as const

export type FileKind = (typeof fileKinds)[number]

const governed = /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//

export const isGoverned = (path: string): boolean => governed.test(path.replaceAll("\\", "/"))

export const kindOf = (path: string): FileKind | undefined => {
  const file = path.replaceAll("\\", "/").split("/").at(-1) ?? ""
  return fileKinds.find((k) => ("name" in k ? file === k.name : file.endsWith(k.suffix)))
}

/** Kinds whose files may hold no side effects at all. */
export const dataKinds: ReadonlyArray<string> = [".pure.ts", ".component.style.ts", ".token.ts", ".theme.ts"]

export const allowedList = fileKinds.map((k) => ("name" in k ? k.name : `*${k.suffix}`)).join(", ")
