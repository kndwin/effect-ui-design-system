import { Array, Record } from "effect"
import { type Style, UncompiledStyleError } from "./style.make.ts"
import { isStyleDefinition } from "./style.pure.predicate.ts"

export const getStyleClasses = <Slot extends string, P>({
  style,
  props
}: {
  readonly style: Style<any, Slot, P>
  readonly props: NoInfer<P>
}): { readonly [S in Slot]: string } => {
  if (isStyleDefinition({ value: style }))
    throw new UncompiledStyleError({ kit: (style as unknown as { kit: { name: string } }).kit.name })
  const picked = Record.filter(
    Record.fromEntries(Array.map(Record.keys(style.variants), (k) => [k, (props as any)?.[k]] as const)),
    (v) => v !== undefined
  )
  return Record.map(style.slots as Record<Slot, (p: unknown) => string>, (fn) => fn(picked)) as {
    readonly [S in Slot]: string
  }
}
