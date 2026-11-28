import type * as Loom from "../loom/loom.make.ts"
import type { ScenarioWithArgs } from "../loom/loom.schema.ts"
import type { MessageLog } from "@effect/ui"
import { Mount } from "@effect/ui"
import { BrowserHost } from "@effect/ui/html"
import { DevTools } from "@effect/ui-devtools"
import {
  Array,
  Context,
  Duration,
  Effect,
  Exit,
  Layer,
  Match,
  Option,
  Predicate,
  Queue,
  Ref,
  Schema,
  Scope,
  Stream
} from "effect"
import { MessageLog as Log } from "@effect/ui"
import type { Recording } from "../../feature/timeline/timeline.schema.ts"
import { mapMessageToLabel } from "../../feature/timeline/timeline.pure.map.ts"
import { LoomHost } from "../host/host.component.ts"

export class LoomRegistry extends Context.Service<LoomRegistry, ReadonlyArray<Loom.Loom>>()("weft/loom/LoomRegistry") {}

const stepGap = 400
const firstStep = 300

const depthOf = (path: string) => path.split("/").length - 1

const isStateEntry = (entry: MessageLog.Entry) =>
  Predicate.isTagged(entry, "Mounted") ||
  Predicate.isTagged(entry, "Update") ||
  Predicate.isTagged(entry, "PropsChanged")

const instanceEntries = (entries: ReadonlyArray<MessageLog.Entry>) =>
  entries.filter((entry): entry is MessageLog.InstanceEntry => "path" in entry)

const displayedPath = (entries: ReadonlyArray<MessageLog.Entry>) =>
  Array.findFirst(
    instanceEntries(entries),
    (entry) => Predicate.isTagged(entry, "Mounted") && depthOf(entry.path) === 2
  ).pipe(Option.map((entry) => entry.path))

const hostPath = (entries: ReadonlyArray<MessageLog.Entry>) =>
  Array.findFirst(
    instanceEntries(entries),
    (entry) => Predicate.isTagged(entry, "Mounted") && depthOf(entry.path) === 1
  ).pipe(Option.map((entry) => entry.path))

const modelAt = (entries: ReadonlyArray<MessageLog.Entry>, path: string, seq: number) =>
  Array.findLast(
    instanceEntries(entries),
    (entry) =>
      entry.path === path &&
      entry.seq <= seq &&
      (Predicate.isTagged(entry, "Mounted") || Predicate.isTagged(entry, "Update"))
  ).pipe(Option.map((entry) => (entry as MessageLog.Update).model))

const propsAt = (entries: ReadonlyArray<MessageLog.Entry>, path: string, seq: number) =>
  Array.findLast(
    instanceEntries(entries),
    (entry) => entry.path === path && entry.seq <= seq && isStateEntry(entry)
  ).pipe(Option.map((entry) => (entry as MessageLog.Update).props))

const show = (value: Option.Option<unknown>) =>
  Option.match(value, { onNone: () => "", onSome: (v) => JSON.stringify(v, null, 2) ?? "" })

const clipsOf = (entries: ReadonlyArray<MessageLog.Entry>) =>
  Option.match(displayedPath(entries), {
    onNone: () => [],
    onSome: (path) =>
      instanceEntries(entries)
        .filter((entry): entry is MessageLog.Update => Predicate.isTagged(entry, "Update") && entry.path === path)
        .map((entry, index, updates) => ({
          seq: entry.seq,
          at: entry.at,
          ...mapMessageToLabel({ message: entry.message }),
          model: show(Option.some(entry.model)),
          args: show(
            Option.flatMap(hostPath(entries), (host) =>
              modelAt(
                entries,
                host,
                Option.match(Array.get(updates, index + 1), {
                  onNone: () => Number.MAX_SAFE_INTEGER,
                  onSome: (next) => next.seq - 1
                })
              )
            )
          )
        }))
  })

const latestArgs = (entries: ReadonlyArray<MessageLog.Entry>) =>
  show(Option.flatMap(hostPath(entries), (host) => modelAt(entries, host, Number.MAX_SAFE_INTEGER)))

const recordingOf = (entries: ReadonlyArray<MessageLog.Entry>): Recording => ({
  clips: clipsOf(entries),
  args: latestArgs(entries)
})

const hostInstance = (entries: ReadonlyArray<MessageLog.Entry>) =>
  Array.findFirst(
    instanceEntries(entries),
    (entry) => Predicate.isTagged(entry, "Mounted") && depthOf(entry.path) === 1
  ).pipe(Option.map((entry) => entry.instance))

const stateAt = (entries: ReadonlyArray<MessageLog.Entry>, seq: number) => (path: string) =>
  Option.match(modelAt(entries, path, seq), {
    onNone: () => undefined,
    onSome: (model) => ({ model, props: Option.getOrUndefined(propsAt(entries, path, seq)) })
  })

const scenarioOf = (loom: Loom.Loom, name: string) =>
  Option.fromNullishOr(loom.scenarios[name]).pipe(
    Option.map((scenario) =>
      Match.value(scenario).pipe(
        Match.when(Array.isArray, (steps) => ({ args: {}, steps: steps as ReadonlyArray<Loom.Step> })),
        Match.orElse((withArgs) => withArgs as ScenarioWithArgs)
      )
    ),
    Option.getOrElse(() => ({ args: {}, steps: [] as ReadonlyArray<Loom.Step> }))
  )

const anchorPopups = (node: HTMLElement) =>
  Effect.sync(() =>
    node.querySelectorAll<HTMLElement>("[inert] [popover]").forEach((popup) => {
      const anchor = Option.fromNullishOr(
        node.querySelector<HTMLElement>(`[inert] [aria-controls="${popup.id}"]`) ??
          popup.parentElement?.querySelector<HTMLElement>("[aria-haspopup]")
      )
      Option.map(anchor, (trigger) => {
        const box = trigger.getBoundingClientRect()
        popup.style.position = "fixed"
        popup.style.inset = "auto"
        popup.style.top = `${box.bottom + 4}px`
        popup.style.left = `${box.left}px`
        popup.style.minWidth = `${box.width}px`
      })
    })
  )

const dispatchTo = (root: BrowserHost.Controllable, entries: ReadonlyArray<MessageLog.Entry>, message: unknown) => {
  const instances = Array.dedupe(
    instanceEntries(entries)
      .filter((entry) => Predicate.isTagged(entry, "Mounted"))
      .toSorted((a, b) => depthOf(b.path) - depthOf(a.path))
      .map((entry) => entry.instance)
  )
  return Array.findFirst(
    Array.getSomes(instances.map((instance) => Option.fromNullishOr(root.instance(instance)))),
    (instance) => Schema.is(instance.message)(message)
  ).pipe(
    Option.match({
      onNone: () => Effect.void,
      onSome: (instance) => Effect.asVoid(instance.dispatch(message))
    })
  )
}

export const LoomCanvas = Mount.makeStream(
  "weft/loom/Canvas",
  {
    args: {
      title: Schema.String,
      scenario: Schema.String,
      run: Schema.Number,
      seq: Schema.NullOr(Schema.Number),
      edit: Schema.Struct({ count: Schema.Number, patch: Schema.String })
    }
  },
  (node: HTMLElement, _args, changes) =>
    Stream.unwrap(
      Effect.gen(function* () {
        const looms = yield* LoomRegistry
        const out = yield* Queue.unbounded<Recording>()
        const session = yield* Ref.make(
          Option.none<{
            readonly key: string
            readonly scope: Scope.Closeable
            readonly entries: Array<MessageLog.Entry>
            readonly root: Ref.Ref<Option.Option<BrowserHost.Controllable>>
            readonly paused: Ref.Ref<number | null>
            readonly edits: Ref.Ref<number>
          }>()
        )

        const start = (title: string, name: string, key: string, edits: number) =>
          Effect.gen(function* () {
            yield* Ref.get(session).pipe(
              Effect.flatMap(
                Option.match({ onNone: () => Effect.void, onSome: (s) => Scope.close(s.scope, Exit.void) })
              )
            )
            node.replaceChildren()
            const container = node.appendChild(document.createElement("div"))
            const loom = Array.findFirst(looms, (l) => l.title === title)
            const scope = yield* Scope.make()
            const entries: Array<MessageLog.Entry> = []
            const root = yield* Ref.make(Option.none<BrowserHost.Controllable>())
            const paused = yield* Ref.make<number | null>(null)
            const editCount = yield* Ref.make(edits)
            const last = { key: "" }
            yield* Ref.set(session, Option.some({ key, scope, entries, root, paused, edits: editCount }))
            yield* Queue.offer(out, { clips: [], args: "" })
            const devtools = yield* Layer.build(DevTools.layer({ position: "BottomLeft" })).pipe(Scope.provide(scope))
            const devtoolsControllables = Context.get(devtools, BrowserHost.Controllables)
            const log = Log.fanoutAll([
              Context.get(devtools, Log.MessageLog),
              {
                enabled: true,
                record: (entry) => {
                  entries.push(entry)
                  const recording = recordingOf(entries)
                  const key = JSON.stringify(recording)
                  if (key === last.key) return
                  last.key = key
                  Queue.offerUnsafe(out, recording)
                }
              }
            ])
            const controllables: BrowserHost.Controllables = {
              register: (controllable) => {
                Effect.runSync(Ref.set(root, Option.some(controllable)))
                return devtoolsControllables.register(controllable)
              }
            }
            yield* Option.match(loom, {
              onNone: () => Effect.void,
              onSome: (found) => {
                const scenario = scenarioOf(found, name)
                return BrowserHost.mountEffect(LoomHost, { loom: found, args: scenario.args }, container).pipe(
                  Effect.provideService(Log.MessageLog, log),
                  Effect.provideService(BrowserHost.Controllables, controllables),
                  Scope.provide(scope),
                  Effect.andThen(
                    Effect.forEach(
                      scenario.steps,
                      (step, index) =>
                        Effect.sleep(
                          Duration.millis(
                            Match.value(index).pipe(
                              Match.when(0, () => firstStep),
                              Match.orElse(() => stepGap)
                            )
                          )
                        ).pipe(
                          Effect.andThen(
                            Match.value(step).pipe(
                              Match.when(Predicate.isFunction, (act) =>
                                Effect.sync(() => (act as (root: HTMLElement) => void)(container))
                              ),
                              Match.orElse((message) =>
                                Ref.get(root).pipe(
                                  Effect.flatMap(
                                    Option.match({
                                      onNone: () => Effect.void,
                                      onSome: (controllable) => dispatchTo(controllable, entries, message)
                                    })
                                  )
                                )
                              )
                            )
                          )
                        ),
                      { discard: true }
                    ).pipe(Effect.forkIn(scope))
                  )
                )
              }
            })
          })

        const scrub = (seq: number | null) =>
          Ref.get(session).pipe(
            Effect.flatMap(
              Option.match({
                onNone: () => Effect.void,
                onSome: (s) =>
                  Effect.gen(function* () {
                    const was = yield* Ref.get(s.paused)
                    const controllable = yield* Ref.get(s.root)
                    yield* Match.value(Option.isSome(controllable) && was !== seq).pipe(
                      Match.when(false, () => Effect.void),
                      Match.orElse(() =>
                        Effect.gen(function* () {
                          const root = Option.getOrThrow(controllable)
                          yield* Ref.set(s.paused, seq)
                          yield* Match.value(seq).pipe(
                            Match.when(null, () => root.resume),
                            Match.orElse((at) =>
                              root.pause(stateAt(s.entries, at)).pipe(Effect.andThen(anchorPopups(node)))
                            )
                          )
                        })
                      )
                    )
                  })
              })
            )
          )

        const edit = (count: number, patch: string) =>
          Ref.get(session).pipe(
            Effect.flatMap(
              Option.match({
                onNone: () => Effect.void,
                onSome: (s) =>
                  Effect.gen(function* () {
                    const was = yield* Ref.getAndSet(s.edits, count)
                    const controllable = yield* Ref.get(s.root)
                    yield* Match.value(was !== count && patch !== "").pipe(
                      Match.when(false, () => Effect.void),
                      Match.orElse(() =>
                        Option.match(
                          Option.flatMap(
                            Option.zipWith(controllable, hostInstance(s.entries), (c, n) => c.instance(n)),
                            Option.fromNullishOr
                          ),
                          {
                            onNone: () => Effect.void,
                            onSome: (instance) => Effect.asVoid(instance.dispatch(JSON.parse(patch)))
                          }
                        )
                      )
                    )
                  })
              })
            )
          )

        yield* changes.pipe(
          Stream.runForEach((args) =>
            Effect.gen(function* () {
              const key = `${args.title}/${args.scenario}/${args.run}`
              const current = yield* Ref.get(session)
              yield* Match.value(Option.exists(current, (s) => s.key === key)).pipe(
                Match.when(true, () => Effect.andThen(edit(args.edit.count, args.edit.patch), scrub(args.seq))),
                Match.orElse(() => start(args.title, args.scenario, key, args.edit.count))
              )
            })
          ),
          Effect.forkScoped
        )

        yield* Effect.addFinalizer(() =>
          Ref.get(session).pipe(
            Effect.flatMap(Option.match({ onNone: () => Effect.void, onSome: (s) => Scope.close(s.scope, Exit.void) }))
          )
        )

        return Stream.fromQueue(out)
      })
    )
)
