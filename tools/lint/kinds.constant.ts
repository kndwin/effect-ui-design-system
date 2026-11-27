export const kinds: Readonly<Record<string, ReadonlyArray<string>>> = {
  "file-kind": [".ts"],
  comments: [".ts"],
  pure: [".pure.ts", ".make.ts", ".schema.ts", ".constant.ts", ".component.style.ts", ".token.ts", ".theme.ts"],
  make: [".make.ts"],
  schema: [".schema.ts"],
  constant: [".constant.ts"],
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
  { suffix: ".schema.ts", doc: "schema" },
  { suffix: ".constant.ts", doc: "constant" },
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
