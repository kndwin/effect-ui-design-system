import { Button as KitButton } from "@effect/ui-kit/Button"
import { Command, UiSchema } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import { Html as H } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Effect, Schema } from "effect"
import { highlight, type Language } from "../highlight.pure.ts"
import * as Kit from "../Kit.pure.ts"

const CodeBlockDescriptor = Kit.describe({
  name: "CodeBlock",
  parts: {
    root: { states: {} },
    header: { states: {} },
    title: { states: {} },
    copy: { states: { copied: "[data-copied]", floating: "[data-floating]" } },
    content: { states: { wrap: "[data-wrap]" } },
    line: {
      states: { added: "[data-mark=added]", removed: "[data-mark=removed]", highlighted: "[data-mark=highlighted]" }
    },
    lineNumber: { states: {} },
    token: {
      states: {
        comment: "[data-token=comment]",
        string: "[data-token=string]",
        keyword: "[data-token=keyword]",
        number: "[data-token=number]",
        type: "[data-token=type]",
        call: "[data-token=call]"
      }
    }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})
export interface CodeBlockKit extends Kit.Type<typeof CodeBlockDescriptor> {}
export const CodeBlock: CodeBlockKit = CodeBlockDescriptor

export type LineMark = "added" | "removed" | "highlighted"

export interface CodeBlockOptions {
  readonly code: string

  readonly title?: string | undefined
  readonly language?: Language | undefined
  readonly lineNumbers?: boolean | undefined
  readonly startLine?: number | undefined

  readonly marks?: Readonly<Record<number, LineMark>> | undefined
  readonly wrap?: boolean | undefined

  readonly copy?: boolean | undefined
  readonly key?: string | undefined
  readonly class?: string | undefined
}

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
    const copy =
      p.copy === false
        ? undefined
        : KitButton(h, { onPress: Msg.PressedCopy() })
            .class(c.copy)
            .attr("data-copied", model.copied ? "" : undefined)
            .attr("data-floating", floating ? "" : undefined)
            .attr("aria-label", model.copied ? "Copied" : "Copy")
            .attr("title", model.copied ? "Copied" : "Copy")
            .children(model.copied ? checkIcon(h) : copyIcon(h))
    return h.div.class(c.root, p.extraClass).children(
      floating ? copy : h.div.class(c.header).children(h.span.class(c.title).children(p.title ?? ""), copy),
      h.pre
        .class(c.content)
        .attr("data-wrap", p.wrap ? "" : undefined)
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
                  p.lineNumbers
                    ? h.span.class(c.lineNumber).attr("aria-hidden", "true").children(String(n))
                    : undefined,
                  ...(line === ""
                    ? [" "]
                    : highlight(line, p.language ?? "ts").map(([kind, text]) =>
                        kind === "plain" ? text : h.span.class(c.token).attr("data-token", kind).children(text)
                      ))
                )
            })
          )
        ),

      h.span
        .attr("aria-live", "polite")
        .attr("style", "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)")
        .children(model.copied ? "Copied" : "")
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

export const renderCodeBlock = <Msg>(
  h: Html.H<Msg>,
  options: CodeBlockOptions,
  classes: typeof Classes.Type
): Child<Msg> =>
  Impl(h, {
    ...(options.key === undefined ? {} : { key: options.key }),
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
