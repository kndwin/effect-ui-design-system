import { dirname, relative, sep } from "node:path"

export const kinds: Readonly<Record<string, ReadonlyArray<string>>> = {
  "file-kind": [".ts"],
  comments: [".ts"],
  pure: [".pure.ts", ".component.style.ts", ".token.ts", ".theme.ts"],
  component: [".component.ts"],
  "component.style": [".component.style.ts"],
  token: [".token.ts"],
  theme: [".theme.ts"],
  build: [".build.ts"]
}

export const fileKinds = [
  { suffix: ".component.style.ts", doc: "component.style" },
  { suffix: ".component.ts", doc: "component" },
  { suffix: ".token.ts", doc: "token" },
  { suffix: ".theme.ts", doc: "theme" },
  { suffix: ".pure.ts", doc: "pure" },
  { suffix: ".build.ts", doc: "build" },
  { suffix: ".d.ts" },
  { suffix: ".test.ts", test: true },
  { suffix: ".test-d.ts", test: true },
  { suffix: ".fixture.ts", test: true },
  { name: "main.ts" }
] as const

export type FileKind = (typeof fileKinds)[number]

export const allowed = fileKinds.map((k) => ("name" in k ? k.name : `*${k.suffix}`)).join(", ")

const skipped = /(^|\/)(node_modules|vendor|dist|\.git)\//

const posix = (path: string) => path.split(sep).join("/")

export const isGoverned = (path: string): boolean =>
  /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//.test(posix(path))

export const kindOf = (path: string): FileKind | undefined => {
  const file = posix(path).split("/").at(-1) ?? ""
  return fileKinds.find((k) => ("name" in k ? file === k.name : file.endsWith(k.suffix)))
}

export const ruleKindOf = (ruleFile: string): string =>
  (posix(ruleFile).split("/").at(-1) ?? "").replace(/\.rule\.(md|yml|ts)$/, "")

export const inScope = (ruleFile: string, file: string): boolean => {
  const within = posix(relative(dirname(ruleFile), file))
  if (within.startsWith("..") || skipped.test(`/${within}`)) return false
  return (kinds[ruleKindOf(ruleFile)] ?? []).some((suffix) => within.endsWith(suffix))
}
