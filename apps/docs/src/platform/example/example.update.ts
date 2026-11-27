import { ExampleDef } from "./example.define.ts"

export const update = ExampleDef.update({ PressedTab: ($, { tab }) => $.evolve({ tab }) })
