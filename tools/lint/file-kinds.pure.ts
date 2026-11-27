// The file kinds allowed under packages/*/src, packages/themes/*/src, apps/*/src and test/.
// One table, used by the lint plugin (and documented in the README).
export const fileKinds = [
  { suffix: ".component.ts", what: "defines an Html.component (checked by ast-grep)" },
  { suffix: ".pure.ts", what: "pure functions and data only (acme/pure)" },
  { suffix: ".css.ts", what: "vanilla-extract styles and themes; tokens only in @acme/components" },
  { suffix: ".vanilla.ts", what: "build-time APIs that call vanilla-extract (Theme.make, Style.make)" },
  { suffix: ".d.ts", what: "type declarations" },
  { suffix: ".test.ts", what: "tests (test/ only)" },
  { suffix: ".test-d.ts", what: "type tests (test/ only)" },
  { name: "index.ts", what: "re-exports only (checked by ast-grep)" },
  { name: "main.ts", what: "app entry (apps/* only)" }
] as const

const governed = /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//

export const isGoverned = (path: string): boolean => governed.test(path.replaceAll("\\", "/"))

export const kindOf = (path: string): string | undefined => {
  const file = path.replaceAll("\\", "/").split("/").at(-1) ?? ""
  for (const k of fileKinds) {
    if ("name" in k ? file === k.name : file.endsWith(k.suffix)) return "name" in k ? k.name : k.suffix
  }
  return undefined
}

export const allowedList = fileKinds.map((k) => ("name" in k ? k.name : `*${k.suffix}`)).join(", ")
