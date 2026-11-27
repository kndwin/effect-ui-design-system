import { NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect } from "effect"
import { Argument, Command, Flag } from "effect/cli"
import { runAdd } from "../../feature/add/add.build.ts"
import { runTheme } from "../../feature/theme/theme.build.ts"

const fail = (error: { readonly message: string }) =>
  Console.error(error.message).pipe(Effect.andThen(Effect.sync(() => (process.exitCode = 1))))

const overwrite = Flag.Boolean("overwrite").pipe(
  Flag.withDescription("Replace files you already have. Without it, your edits are kept."),
  Flag.withDefault(false)
)

const ui = Flag.String("dir").pipe(
  Flag.withDescription("Where your components live."),
  Flag.withDefault("src/components/ui")
)

const add = Command.make(
  "add",
  {
    names: Argument.String("components").pipe(
      Argument.withDescription("Components to copy, e.g. button dialog stack. Leave empty to list them."),
      Argument.variadic()
    ),
    dir: ui,
    overwrite
  },
  (options) => runAdd(options).pipe(Effect.catchTag("UnknownComponentError", fail))
).pipe(Command.withDescription("Copy components and everything they import into your app."))

const theme = Command.make(
  "theme",
  {
    base: Argument.String("base").pipe(Argument.withDescription("The theme to start from: shadcn or astryx.")),
    name: Flag.String("name").pipe(Flag.withDescription("Your theme's name."), Flag.withDefault("brand")),
    dir: Flag.String("dir").pipe(Flag.withDescription("Where the theme file goes."), Flag.withDefault("src")),
    ui: Flag.String("ui").pipe(
      Flag.withDescription("Where your components and token contract live."),
      Flag.withDefault("src/components/ui")
    ),
    overwrite
  },
  (options) =>
    runTheme(options).pipe(Effect.catchTag("UnknownThemeError", fail), Effect.catchTag("InvalidThemeNameError", fail))
).pipe(Command.withDescription("Start your own theme from a copy of a shipped one."))

const weft = Command.make("weft").pipe(Command.withSubcommands([add, theme]))

Command.run(weft, { version: "0.0.0" }).pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain)
