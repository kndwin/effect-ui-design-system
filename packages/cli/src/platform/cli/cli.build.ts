import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Console, Effect } from "effect"
import { Argument, Command, Flag } from "effect/cli"
import { runAdd } from "../../feature/add/add.build.ts"

const names = Argument.String("components").pipe(
  Argument.withDescription("Components to copy, e.g. button dialog stack. Leave empty to list them."),
  Argument.variadic()
)

const dir = Flag.String("dir").pipe(
  Flag.withDescription("Where your components live."),
  Flag.withDefault("src/components/ui")
)

const overwrite = Flag.Boolean("overwrite").pipe(
  Flag.withDescription("Replace files you already have. Without it, your edits are kept."),
  Flag.withDefault(false)
)

const add = Command.make("add", { names, dir, overwrite }, (options) =>
  runAdd(options).pipe(
    Effect.catchTag("UnknownComponentError", (error) =>
      Console.error(error.message).pipe(Effect.andThen(Effect.sync(() => (process.exitCode = 1))))
    )
  )
).pipe(Command.withDescription("Copy components and everything they import into your app."))

const weft = Command.make("weft").pipe(Command.withSubcommands([add]))

Command.run(weft, { version: "0.0.0" }).pipe(Effect.provide(BunServices.layer), BunRuntime.runMain)
