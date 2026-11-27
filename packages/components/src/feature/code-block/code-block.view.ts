import { Button as KitButton } from "@effect/ui-kit/Button"
import type { Html } from "@effect/ui/html"
import { Match } from "effect"
import { CodeBlockDef } from "./code-block.define.ts"
import { CodeBlockMessageSchema } from "./code-block.schema.ts"
import { mapCodeToHighlightTokens } from "./highlight.pure.map.ts"

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

export const view = CodeBlockDef.view((h, model) => {
  const p = h.props
  const c = p.classes
  const first = p.startLine ?? 1
  const lines = p.code.replace(/\n$/, "").split("\n")
  const floating = p.title === undefined
  const copy = Match.value(p.copy === false).pipe(
    Match.when(true, () => undefined),
    Match.orElse(() =>
      KitButton(h, { onPress: CodeBlockMessageSchema.PressedCopy() })
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
                    mapCodeToHighlightTokens({ code: line, language: p.language ?? "ts" }).map(([kind, text]) =>
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
})
