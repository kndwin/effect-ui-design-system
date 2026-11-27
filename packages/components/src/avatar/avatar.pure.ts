import { Hash } from "effect"
export const getByName = <A>({ name, values }: { readonly name: string; readonly values: ReadonlyArray<A> }): A =>
  values[Math.abs(Hash.string(name)) % values.length]!
