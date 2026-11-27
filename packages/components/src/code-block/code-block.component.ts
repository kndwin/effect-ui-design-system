import * as Style from "@acme/design-system/Style"
import { Button as KitButton } from "@effect/ui-kit/Button"
import { Command, UiSchema } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import { Html as H } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Effect, Match, Schema } from "effect"
import type { CodeBlockOptions, LineMark } from "./code-block.schema.ts"
import { getHighlightTokens } from "./highlight.pure.ts"

import { CodeBlockStyle } from "./code-block.component.style.ts"

export type CodeBlockProps = Style.Props<typeof CodeBlockStyle>

const Msg = UiSchema.TaggedEnum({ PressedCopy: {}, Copied: {}, CopyFailed: {}, ClearedCopied: {} })

const Copy = Command.make("acme/CodeBlock/Copy", { args: { text: Schema.String } }, ({ text }) =>
  Effect.tryPromise(() => navigator.clipboard.writeText(text)).pipe(
    Effect.match({ onSuccess: () => Msg.Copied(), onFailure: () => Msg.CopyFailed() })
  )
)
const ClearCopied = Command.make("acme/CodeBlock/ClearCopied", { args: {}, mode: "switch" }, () =>
  Effect.sleep("2 seconds").pipe(Effect.as(Msg.ClearedCopied()))
)

const Classes = Schema.Struct({
  root: Schema.String,
  header: Schema.String,
  title: Schema.String,
  copy: Schema.String,
  content: Schema.String,
  line: Schema.String,
  lineNumber: Schema.String,
  token: Schema.String
})

const Impl = H.component({
  name: "CodeBlock",
  props: Schema.Struct({
    code: Schema.String,
    title: Schema.optional(Schema.String),
    language: Schema.optional(Schema.Literals(["ts", "shell", "plain"])),
    lineNumbers: Schema.optional(Schema.Boolean),
    startLine: Schema.optional(Schema.Number),
    marks: Schema.optional(Schema.Record(Schema.String, Schema.Literals(["added", "removed", "highlighted"]))),
    wrap: Schema.optional(Schema.Boolean),
    copy: Schema.optional(Schema.Boolean),
    extraClass: Schema.optional(Schema.String),
    classes: Classes
  }),
  model: Schema.Struct({ copied: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ copied: false }),
  update: {
    PressedCopy: ($) => $.run(Copy.make({ text: $.props.code })),
    Copied: ($) => $.evolve({ copied: true }).run(ClearCopied.make({})),
    CopyFailed: ($) => $.model,
    ClearedCopied: ($) => $.evolve({ copied: false })
  },
  view: (h, model) => {
    const p = h.props
    const c = p.classes
    const first = p.startLine ?? 1
    const lines = p.code.replace(/\n$/, "").split("\n")
    const floating = p.title === undefined
    const copy = Match.value(p.copy === false).pipe(
      Match.when(true, () => undefined),
      Match.orElse(() =>
        KitButton(h, { onPress: Msg.PressedCopy() })
          .class(c.copy)
          .attr(
            "data-copied",
            Match.value(model.copied).pipe(
              Match.when(true, () => ""),
              Match.orElse(() => undefined)
            )
          )
          .attr(
            "data-floating",
            Match.value(floating).pipe(
              Match.when(true, () => ""),
              Match.orElse(() => undefined)
            )
          )
          .attr(
            "aria-label",
            Match.value(model.copied).pipe(
              Match.when(true, () => "Copied"),
              Match.orElse(() => "Copy")
            )
          )
          .attr(
            "title",
            Match.value(model.copied).pipe(
              Match.when(true, () => "Copied"),
              Match.orElse(() => "Copy")
            )
          )
          .children(
            Match.value(model.copied).pipe(
              Match.when(true, () => checkIcon(h)),
              Match.orElse(() => copyIcon(h))
            )
          )
      )
    )
    return h.div.class(c.root, p.extraClass).children(
      Match.value(floating).pipe(
        Match.when(true, () => copy),
        Match.orElse(() => h.div.class(c.header).children(h.span.class(c.title).children(p.title ?? ""), copy))
      ),
      h.pre
        .class(c.content)
        .attr(
          "data-wrap",
          Match.value(p.wrap).pipe(
            Match.when(true, () => ""),
            Match.orElse(() => undefined)
          )
        )
        .attr("dir", "ltr")
        .attr("tabindex", "0")
        .children(
          h.code.children(
            ...lines.map((line, i) => {
              const n = first + i
              return h.span
                .class(c.line)
                .attr("data-mark", p.marks?.[String(n)])
                .children(
                  Match.value(p.lineNumbers).pipe(
                    Match.when(true, () => h.span.class(c.lineNumber).attr("aria-hidden", "true").children(String(n))),
                    Match.orElse(() => undefined)
                  ),
                  ...Match.value(line === "").pipe(
                    Match.when(true, () => [" "]),
                    Match.orElse(() =>
                      getHighlightTokens({ code: line, language: p.language ?? "ts" }).map(([kind, text]) =>
                        Match.value(kind === "plain").pipe(
                          Match.when(true, () => text),
                          Match.orElse(() => h.span.class(c.token).attr("data-token", kind).children(text))
                        )
                      )
                    )
                  )
                )
            })
          )
        ),

      h.span
        .attr("aria-live", "polite")
        .attr("style", "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)")
        .children(
          Match.value(model.copied).pipe(
            Match.when(true, () => "Copied"),
            Match.orElse(() => "")
          )
        )
    )
  }
})

const icon = <Msg>(h: Html.H<Msg>, d: string) =>
  h.svg
    .attr("viewBox", "0 0 24 24")
    .attr("width", "14")
    .attr("height", "14")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-width", "2")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("aria-hidden", "true")
    .children(h.path.attr("d", d))
const copyIcon = <Msg>(h: Html.H<Msg>) =>
  icon(
    h,
    "M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2zM16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
  )
const checkIcon = <Msg>(h: Html.H<Msg>) => icon(h, "M20 6 9 17l-5-5")

export const CodeBlock = <Msg>(h: Html.H<Msg>, options: CodeBlockOptions & CodeBlockProps): Child<Msg> => {
  const classes = Style.classes(CodeBlockStyle, options)
  return Impl(h, {
    ...Match.value(options.key === undefined).pipe(
      Match.when(true, () => ({})),
      Match.orElse(() => ({ key: options.key }))
    ),
    props: {
      code: options.code,
      title: options.title,
      language: options.language,
      lineNumbers: options.lineNumbers,
      startLine: options.startLine,
      marks: options.marks as Record<string, LineMark> | undefined,
      wrap: options.wrap,
      copy: options.copy,
      extraClass: options.class,
      classes
    }
  })
}
