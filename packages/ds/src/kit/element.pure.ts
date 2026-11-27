// Components the design system owns outright (layout, Text, Swatch): one `root` part, no ui-kit
// counterpart. They style the element you pass, so any tag works and the result keeps its type:
//   HStack(h.nav, { gap: "2" }).children(…)
import * as Kit from "../Kit.pure.ts"

/** A single-part descriptor, named for error messages and the manifest. */
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

/** Anything with Html's `.class(...)`, which appends classes. */
export interface Classable {
  class(...tokens: ReadonlyArray<string | false | null | undefined>): unknown
}
/** What `.class(...)` gives back for that element: the builder, with its tag and events. */
export type Classed<E extends Classable> = ReturnType<E["class"]>

/** Applies a component's root class (and the caller's) to the element. */
export const render = <E extends Classable>(
  element: E,
  classes: { readonly root: string },
  extra?: string
): Classed<E> => element.class(classes.root, extra) as Classed<E>
