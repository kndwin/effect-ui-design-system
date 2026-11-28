import { Button } from "@weft/components/button"
import { Layout, LayoutContent, LayoutHeader, LayoutPanel } from "@weft/components/layout/layout"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Text } from "@weft/components/text"
import { Mount } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import { Match, Option } from "effect"
import {
  getClipRows,
  getCurrentClip,
  getDuration,
  getOffset,
  getPercent,
  getPlayhead,
  getSeqAt,
  getTicks
} from "../../feature/timeline/timeline.pure.ts"
import { mapTimeToLabel } from "../../feature/timeline/timeline.pure.map.ts"
import type { Clip } from "../../feature/timeline/timeline.schema.ts"
import { LoomCanvas } from "../canvas/canvas.command.ts"
import { Logo } from "../ui/ui.view.ts"
import { AppDef } from "./app.define.ts"
import { type AppModel, AppMessageSchema, type LoomEntry, type Selected } from "./app.schema.ts"

type H = Html.H<typeof AppMessageSchema.Type>

const lane = 96
const clipWidth = 160
const defaultGap = 400
const minClipWidth = 120

const css = (rules: Readonly<Record<string, string | number>>) =>
  Object.entries(rules)
    .map(([name, value]) => `${name}:${value}`)
    .join(";")

const when = <A>(condition: boolean, yes: () => A, no: () => A) =>
  Match.value(condition).pipe(Match.when(true, yes), Match.orElse(no))

const isSelected = (model: AppModel, selected: Selected) =>
  model.selected.title === selected.title && model.selected.scenario === selected.scenario

const Entry = (h: H, model: AppModel, selected: Selected, text: string) =>
  Button(h, {
    size: "sm",
    tone: when(
      isSelected(model, selected),
      () => "neutral" as const,
      () => "ghost" as const
    ),
    fill: true,
    onPress: AppMessageSchema.PressedScenario({ selected }),
    children: text
  })

const LoomLinks = (h: H, model: AppModel, loom: LoomEntry) =>
  VStack(h.div, { gap: "1", align: "stretch" }).children(
    Text(h.div, { weight: "semibold" }).children(loom.title),
    Entry(h, model, { title: loom.title, scenario: "" }, "◇ Playground"),
    Text(h.div, { size: "xs", tone: "muted", caps: true }).children("Scenarios"),
    ...loom.scenarios.map((scenario, index) =>
      Entry(h, model, { title: loom.title, scenario }, `${index + 1} · ${scenario}`)
    )
  )

const Sidebar = AppDef.fragment((h, model: AppModel) =>
  VStack(h.nav, { gap: "6", align: "stretch" }).children(
    Text(h.div, { size: "xs", tone: "muted", caps: true }).children("Components"),
    ...h.props.looms.map((loom) => LoomLinks(h, model, loom))
  )
)

const Header = AppDef.fragment((h, model: AppModel) =>
  LayoutHeader(h.header).children(
    HStack(h.div, { gap: "2" }).children(
      Logo(h, 22),
      Text(h.span, { weight: "semibold" }).children("Weft"),
      Text(h.span, { tone: "muted" }).children("Loom")
    ),
    HStack(h.div, { gap: "3" }).children(
      Text(h.span, { size: "sm", tone: "muted" }).children(`Theme ${h.props.theme}`),
      Button(h, {
        size: "sm",
        onPress: AppMessageSchema.PressedMode(),
        children: when(
          model.mode === "light",
          () => "☾ Dark",
          () => "☀ Light"
        )
      })
    )
  )
)

const title = (model: AppModel) =>
  when(
    model.selected.scenario === "",
    () => `${model.selected.title} · Playground`,
    () => `${model.selected.title} · ${model.selected.scenario}`
  )

const Canvas = AppDef.fragment((h, model: AppModel) =>
  h.div
    .attr(
      "style",
      css({
        position: "relative",
        flex: 1,
        display: "grid",
        "place-items": "center",
        "min-height": 0,
        "background-image": "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
        "background-size": "16px 16px",
        "border-bottom": "1px solid var(--color-border)"
      })
    )
    .children(
      Text(h.div, { size: "xs", tone: "muted", mono: true })
        .attr("style", css({ position: "absolute", top: "12px", left: "16px" }))
        .children(title(model)),
      h.div.attr("style", css({ width: "280px", "padding-bottom": "120px" })).onMount(
        LoomCanvas({
          title: model.selected.title,
          scenario: model.selected.scenario,
          run: model.run,
          seq: Match.value(model.at).pipe(
            Match.when(null, () => null),
            Match.orElse((at) => getSeqAt({ clips: model.clips, at }))
          )
        }).pipe(Mount.map((clips) => AppMessageSchema.Recorded({ clips })))
      )
    )
)

const Ruler = (h: H, clips: ReadonlyArray<Clip>) => {
  const duration = getDuration({ clips })
  return h.div
    .attr("style", css({ position: "relative", height: "26px", "border-bottom": "1px solid var(--color-border)" }))
    .children(
      ...getTicks({ duration }).map((tick) =>
        h.div
          .attr(
            "style",
            css({
              position: "absolute",
              bottom: 0,
              left: `${getPercent({ clips, at: tick.at })}%`,
              height: when(
                tick.major,
                () => "10px",
                () => "5px"
              ),
              "border-left": "1px solid var(--color-border)"
            })
          )
          .children(
            ...when(
              tick.major,
              () => [
                Text(h.span, { size: "xs", tone: "muted", mono: true })
                  .attr("style", css({ position: "absolute", bottom: "12px", left: "-18px" }))
                  .children(mapTimeToLabel({ at: tick.at }))
              ],
              () => []
            )
          )
      )
    )
}

const ClipBox = (
  h: H,
  clips: ReadonlyArray<Clip>,
  clip: Clip,
  index: number,
  row: number,
  playhead: number,
  current: number
) => {
  const offset = getOffset({ clips, at: clip.at })
  const next = Option.match(Option.fromNullishOr(clips[index + 1]), {
    onNone: () => offset + defaultGap,
    onSome: (after) => getOffset({ clips, at: after.at })
  })
  const active = clip.seq === current
  return h.div
    .attr(
      "style",
      css({
        position: "absolute",
        top: `${8 + row * 44}px`,
        left: `${getPercent({ clips, at: offset })}%`,
        width: `max(${minClipWidth}px, calc(${getPercent({ clips, at: next - offset })}% - 4px))`,
        "max-width": `${clipWidth}px`,
        overflow: "hidden",
        "box-sizing": "border-box",
        padding: "4px 8px",
        "border-radius": "6px",
        border: "1px solid var(--color-accent)",
        background: when(
          active,
          () => "var(--color-accent)",
          () => "color-mix(in oklch, var(--color-accent) 8%, var(--color-surface))"
        ),
        color: when(
          active,
          () => "var(--color-accentFg)",
          () => "inherit"
        ),
        opacity: when(
          offset > playhead,
          () => 0.35,
          () => 1
        ),
        "pointer-events": "none"
      })
    )
    .children(
      h.div
        .attr(
          "style",
          css({ "font-size": "11px", "font-weight": 600, "white-space": "nowrap", "font-family": "var(--font-mono)" })
        )
        .children(clip.tag),
      h.div
        .attr(
          "style",
          css({
            display: "flex",
            "justify-content": "space-between",
            gap: "6px",
            "font-size": "11px",
            opacity: 0.7,
            "white-space": "nowrap",
            "font-family": "var(--font-mono)"
          })
        )
        .children(h.span(clip.payload || " "), h.span(`#${clip.seq}`))
    )
}

const Track = AppDef.fragment((h, model: AppModel) => {
  const clips = model.clips
  const playhead = getPlayhead({ clips, at: model.at })
  const duration = getDuration({ clips })
  const rows = getClipRows({ clips })
  const current = Option.match(getCurrentClip({ clips, at: model.at }), { onNone: () => -1, onSome: (c) => c.seq })
  return h.div.attr("style", css({ position: "relative", "padding-left": `${lane}px` })).children(
    Ruler(h, clips),
    h.div
      .attr("style", css({ position: "relative", height: "98px", "border-bottom": "1px solid var(--color-border)" }))
      .children(
        Text(h.div, { size: "xs", tone: "muted", mono: true })
          .attr("style", css({ position: "absolute", left: `-${lane - 12}px`, top: "40px" }))
          .children(model.selected.title),
        ...clips.map((clip, index) => ClipBox(h, clips, clip, index, rows[index] ?? 0, playhead, current))
      ),
    h.div.attr(
      "style",
      css({
        position: "absolute",
        top: 0,
        bottom: "-12px",
        left: `calc(${lane}px + (100% - ${lane}px) * ${getPercent({ clips, at: playhead }) / 100})`,
        width: "2px",
        background: "var(--color-accent)",
        "pointer-events": "none"
      })
    ),
    Text(h.div, { size: "xs", mono: true })
      .attr(
        "style",
        css({
          position: "absolute",
          top: "-4px",
          left: `calc(${lane}px + (100% - ${lane}px) * ${getPercent({ clips, at: playhead }) / 100})`,
          transform: "translateX(-50%)",
          padding: "1px 6px",
          "border-radius": "4px",
          background: "var(--color-accent)",
          color: "var(--color-accentFg)",
          "pointer-events": "none"
        })
      )
      .children(mapTimeToLabel({ at: playhead })),
    h.input
      .attr("type", "range")
      .attr("aria-label", "Playhead")
      .attr("min", "-1")
      .attr("max", String(duration))
      .attr("step", "1")
      .attr(
        "style",
        css({
          position: "absolute",
          inset: 0,
          left: `${lane}px`,
          width: `calc(100% - ${lane}px)`,
          height: "100%",
          margin: 0,
          opacity: 0,
          cursor: "ew-resize"
        })
      )
      .value(String(playhead))
      .on("input", ({ value }) => AppMessageSchema.Scrubbed({ at: Number(value) }))
  )
})

const Transport = AppDef.fragment((h, model: AppModel) =>
  HStack(h.div, { justify: "between", gap: "3" }).children(
    HStack(h.div, { gap: "2" }).children(
      Text(h.span, { mono: true }).children(
        when(
          model.selected.scenario === "",
          () => "playground",
          () => model.selected.scenario
        )
      ),
      Text(h.span, { tone: "muted" }).children(`· ${model.clips.length} messages`)
    ),
    HStack(h.div, { gap: "2" }).children(
      Button(h, {
        size: "sm",
        label: "Start",
        onPress: AppMessageSchema.PressedStep({ direction: "start" }),
        children: "⏮"
      }),
      Button(h, {
        size: "sm",
        label: "Previous message",
        onPress: AppMessageSchema.PressedStep({ direction: "back" }),
        children: "◀"
      }),
      Button(h, { size: "sm", tone: "primary", onPress: AppMessageSchema.PressedRun(), children: "▶ Run" }),
      Button(h, {
        size: "sm",
        label: "Next message",
        onPress: AppMessageSchema.PressedStep({ direction: "forward" }),
        children: "▶|"
      }),
      Text(h.span, { size: "sm", tone: "muted", mono: true }).children(
        `${mapTimeToLabel({ at: getPlayhead({ clips: model.clips, at: model.at }) })} / ${mapTimeToLabel({
          at: getPlayhead({ clips: model.clips, at: null })
        })}`
      )
    )
  )
)

const Timeline = AppDef.fragment((h, model: AppModel) =>
  VStack(h.section, { gap: "4", align: "stretch" })
    .attr("style", css({ padding: "12px 16px 28px" }))
    .children(Transport(h, model), Track(h, model))
)

const Block = (h: H, heading: string, body: string) =>
  VStack(h.div, { gap: "1", align: "stretch" }).children(
    Text(h.div, { size: "xs", tone: "muted", caps: true }).children(heading),
    Text(h.pre, { size: "xs", mono: true })
      .attr(
        "style",
        css({
          margin: 0,
          padding: "8px 10px",
          "border-radius": "6px",
          background: "var(--color-surfaceMuted)",
          "white-space": "pre-wrap"
        })
      )
      .children(body)
  )

const Inspector = AppDef.fragment((h, model: AppModel) =>
  Option.match(getCurrentClip({ clips: model.clips, at: model.at }), {
    onNone: () =>
      VStack(h.div, { gap: "4", align: "stretch" }).children(
        Text(h.div, { tone: "muted", size: "sm" }).children(
          "No messages yet. Interact with the component, or run a scenario."
        )
      ),
    onSome: (clip) =>
      VStack(h.div, { gap: "4", align: "stretch" }).children(
        Block(
          h,
          `Message #${clip.seq}`,
          `${clip.tag}${when(
            clip.payload === "",
            () => "",
            () => ` ${clip.payload}`
          )}`
        ),
        Block(h, `${model.selected.title} model`, clip.model),
        Block(h, "Args", clip.args)
      )
  })
)

export const view = AppDef.view((h, model) =>
  Layout(h.div)
    .attr("data-theme", h.props.theme)
    .attr("data-mode", model.mode)
    .children(
      Header(h, model),
      LayoutPanel(h.aside, { side: "start" }).children(Sidebar(h, model)),
      LayoutContent(h.main)
        .attr(
          "style",
          css({ display: "flex", "flex-direction": "column", padding: 0, height: "calc(100vh - var(--size-header))" })
        )
        .children(Canvas(h, model), Timeline(h, model)),
      LayoutPanel(h.aside, { side: "end" }).children(Inspector(h, model))
    )
)
