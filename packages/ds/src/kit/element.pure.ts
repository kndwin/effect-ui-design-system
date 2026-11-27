import * as Kit from "../Kit.pure.ts"

export const describe = <const Name extends string, const States extends Readonly<Record<string, string>> = {}>(
  name: Name,
  states?: States
) =>
  Kit.describe({
    name,
    parts: { root: { states: (states ?? {}) as States } },
    vars: {},
    pseudo: ["hover", "focusVisible"]
  })

export interface Classable {
  class(...tokens: ReadonlyArray<string | false | null | undefined>): unknown
}

export type Classed<E extends Classable> = ReturnType<E["class"]>

export const render = <E extends Classable>(
  element: E,
  classes: { readonly root: string },
  extra?: string
): Classed<E> => element.class(classes.root, extra) as Classed<E>
