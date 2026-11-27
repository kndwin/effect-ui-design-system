export interface Classable {
  class(...tokens: ReadonlyArray<string | false | null | undefined>): unknown
}

export type Classed<E extends Classable> = ReturnType<E["class"]>

export const render = <E extends Classable>(
  element: E,
  classes: { readonly root: string },
  extra?: string
): Classed<E> => element.class(classes.root, extra) as Classed<E>
