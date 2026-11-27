// Typed description of a ui-kit component's DOM contract (parts → states, vars).
// ui-kit documents these in comments only, so the design system owns this map.

export const pseudoSelectors = {
  hover: ":hover",
  focusVisible: ":focus-visible",
  active: ":active"
} as const
export type Pseudo = keyof typeof pseudoSelectors

export interface PartSpec {
  readonly states: Readonly<Record<string, string>>
}

export interface Descriptor<
  Name extends string = string,
  Parts extends Readonly<Record<string, PartSpec>> = Readonly<Record<string, PartSpec>>,
  Vars extends Readonly<Record<string, string>> = Readonly<Record<string, string>>,
  P extends Pseudo = Pseudo
> {
  readonly name: Name
  readonly parts: Parts
  readonly pseudo: ReadonlyArray<P>
  /** typed `var(--anchor-width)` refs, for `Select.vars.anchorWidth` */
  readonly vars: Vars
}

/** Identity alias so a kit file can declare `interface FooKit extends Kit.Type<typeof d> {}` */
export type Type<T> = T

export const describe = <
  const Name extends string,
  const Parts extends Readonly<Record<string, PartSpec>>,
  const Vars extends Readonly<Record<string, string>>,
  const P extends Pseudo
>(
  d: Descriptor<Name, Parts, Vars, P>
): Descriptor<Name, Parts, Vars, P> => d

export type PartName<K> = K extends Descriptor<any, infer Parts, any, any> ? keyof Parts & string : never
export type StateName<K, Part extends string> =
  K extends Descriptor<any, infer Parts, any, infer P>
    ? (Part extends keyof Parts ? keyof Parts[Part]["states"] & string : never) | P
    : never
