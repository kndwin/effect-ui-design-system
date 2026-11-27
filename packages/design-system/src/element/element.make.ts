import { classes, type Props, type Style } from "../style/style.make.ts"

export interface Classable {
  class(...tokens: ReadonlyArray<string | false | null | undefined>): unknown
}

export type Classed<E extends Classable> = ReturnType<E["class"]>

export type StyledOptions<S> = Props<S> & { readonly class?: string | undefined }

export const render = <E extends Classable>(element: E, slots: { readonly root: string }, extra?: string): Classed<E> =>
  element.class(slots.root, extra) as Classed<E>

export const make =
  <Name extends string, P>(style: Style<Name, "root", P>) =>
  <E extends Classable>(
    element: E,
    options: P & { readonly class?: string | undefined } = {} as P & { readonly class?: string | undefined }
  ): Classed<E> =>
    render(element, classes(style, options), options.class)
