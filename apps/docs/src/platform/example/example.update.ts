import { ExampleDef } from "./example.define.ts"

export const update = ExampleDef.update({ ToggledCode: ($, { open }) => $.evolve({ codeOpen: open }) })
