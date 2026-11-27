import { Array, Option, Order } from "effect"
import type { GetComponentNamesInput, GetComponentPathInput } from "./add.schema.ts"

const isComponent = ([, path]: readonly [string, string]) => path.endsWith(".component.ts")

const mapKeyToName = (key: string) => key.split("/").at(-1) ?? key

export const getComponentNames = ({ exports }: GetComponentNamesInput): ReadonlyArray<string> =>
  Array.sort(
    Array.map(Array.filter(Object.entries(exports), isComponent), ([key]) => mapKeyToName(key)),
    Order.String
  )

export const getComponentPath = ({ exports, name }: GetComponentPathInput): Option.Option<string> =>
  Option.map(
    Array.findFirst(
      Array.filter(Object.entries(exports), isComponent),
      ([key]) => key === `./${name}` || mapKeyToName(key) === name
    ),
    ([, path]) => path.replace(/^\.\//, "")
  )
