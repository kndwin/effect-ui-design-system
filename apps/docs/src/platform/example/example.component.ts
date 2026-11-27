import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { ExampleDef } from "./example.define.ts"
import type { ExampleProps } from "./example.schema.ts"
import { update } from "./example.update.ts"
import { view } from "./example.view.ts"

const ExampleImpl = ExampleDef.make({ init: () => ({ codeOpen: false }), update, view })

export const ExampleBlock = <Msg>(h: Html.H<Msg>, props: ExampleProps): Child<Msg> =>
  ExampleImpl(h, { key: props.id, props })
