import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import type { Args, ScenarioWithArgs } from "./loom.schema.ts"

export type Step = unknown

export type Scenario = ReadonlyArray<Step> | ScenarioWithArgs

export interface Loom<A extends Args = Args> {
  readonly title: string
  readonly args: A
  readonly render: (h: Html.H<Args>, args: A) => Child<Args>
  readonly scenarios: Readonly<Record<string, Scenario>>
}

export const make = <const A extends Args>(loom: Loom<A>): Loom<A> => loom
