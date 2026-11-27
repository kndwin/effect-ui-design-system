import { dirname, relative, sep } from "node:path"

export const kinds: Readonly<Record<string, ReadonlyArray<string>>> = {
  "file-kind": [".ts"],
  comments: [".ts"],
  pure: [".pure.ts", ".make.ts", ".component.style.ts", ".token.ts", ".theme.ts"],
  make: [".make.ts"],
  test: [".test.ts"],
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
  { suffix: ".make.ts", doc: "make" },
  { suffix: ".pure.test.ts", doc: "test", colocated: true },
  { suffix: ".pure.ts", doc: "pure" },
  { suffix: ".build.ts", doc: "build" },
  { suffix: ".d.ts" },
  { suffix: ".test.ts", doc: "test", test: true },
  { suffix: ".test-d.ts", test: true },
  { suffix: ".fixture.ts", test: true },
  { name: "main.ts" }
] as const

export type FileKind = (typeof fileKinds)[number]

export const allowed = fileKinds.map((k) => ("name" in k ? k.name : `*${k.suffix}`)).join(", ")

const skipped = /(^|\/)(node_modules|vendor|dist|\.git)\//

export const posix = (path: string) => path.split(sep).join("/")

export const isGoverned = (path: string): boolean =>
  /(^|\/)(packages\/(themes\/)?[^/]+|apps\/[^/]+)\/(src|test)\//.test(posix(path))

export const kindOf = (path: string): FileKind | undefined => {
  const file = posix(path).split("/").at(-1) ?? ""
  return fileKinds.find((k) => ("name" in k ? file === k.name : file.endsWith(k.suffix)))
}

export const ruleKindOf = (ruleFile: string): string => posix(dirname(ruleFile)).split("/").at(-1) ?? ""

export const scopeOf = (ruleFile: string): string => dirname(dirname(dirname(ruleFile)))

export const docPath = (dir: string, kind: string): string => `${dir}/+rule/${kind}/${kind}.md`

export const inScope = (ruleFile: string, file: string): boolean => {
  const within = posix(relative(scopeOf(ruleFile), file))
  if (within.startsWith("..") || skipped.test(`/${within}`)) return false
  return (kinds[ruleKindOf(ruleFile)] ?? []).some((suffix) => within.endsWith(suffix))
}
