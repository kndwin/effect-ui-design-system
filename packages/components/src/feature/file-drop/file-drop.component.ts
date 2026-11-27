import { getStyleClasses } from "@acme/design-system/StyleClasses"
import { FileDrop as KitFileDrop } from "@effect/ui-kit/FileDrop"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Match } from "effect"
import { FileDropStyle } from "./file-drop.component.style.ts"

export const FileDrop = <Msg>(
  h: Html.H<Msg>,
  options: {
    readonly label: string
    readonly onPick: (event: { readonly files: ReadonlyArray<File> }) => NoInfer<Msg> | undefined
    readonly onReject?: ((event: { readonly reason: string }) => NoInfer<Msg> | undefined) | undefined
    readonly trigger?: string | undefined
    readonly hint?: string | undefined
    readonly accept?: ReadonlyArray<string> | undefined
    readonly multiple?: boolean | undefined
    readonly disabled?: boolean | undefined
    readonly key?: string | undefined
  }
): Child<Msg> => {
  const classes = getStyleClasses({ style: FileDropStyle, props: {} })
  return KitFileDrop(h, {
    ...Match.value(options.key).pipe(
      Match.when(undefined, () => ({})),
      Match.orElse((key) => ({ key }))
    ),
    props: { accept: options.accept, multiple: options.multiple, disabled: options.disabled },
    onEmit: {
      Picked: ({ files }) => options.onPick({ files }),
      Rejected: ({ reason }) => options.onReject?.({ reason })
    },
    view: (drop) =>
      drop
        .root(h.div.class(classes.root))
        .children(
          h.span.class(classes.label).children(options.label),
          drop.trigger(h.button.class(classes.trigger)).children(options.trigger ?? "Choose files"),
          h.p.class(classes.hint).children(options.hint ?? "or drop them here")
        )
  }) as Child<Msg>
}
