import { NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect, Option } from "effect"
import { Argument, Command, Flag } from "effect/cli"
import { runAdd } from "../../feature/add/add.build.ts"
import { runInstall } from "../../feature/install/install.build.ts"
import { runTheme } from "../../feature/theme/theme.build.ts"
import { loadPaths } from "../config/config.build.ts"

const fail = (error: { readonly message: string }) =>
  Console.error(error.message).pipe(Effect.andThen(Effect.sync(() => (process.exitCode = 1))))

const overwrite = Flag.Boolean("overwrite").pipe(
  Flag.withDescription("Replace files you already have. Without it, your edits are kept."),
  Flag.withDefault(false)
)

const ui = Flag.String("ui").pipe(
  Flag.withDescription('Where your components live. Defaults to "ui" in components.json, then src/components/ui.'),
  Flag.optional
)

const add = Command.make(
  "add",
  {
    names: Argument.String("components").pipe(
      Argument.withDescription("Components to copy, e.g. button dialog stack. Leave empty to list them."),
      Argument.variadic()
    ),
    ui,
    overwrite
  },
  (options) =>
    Effect.gen(function* () {
      const paths = yield* loadPaths(process.cwd(), { ui: options.ui, themes: Option.none() })
      return yield* runAdd({ names: options.names, dir: paths.ui, overwrite: options.overwrite })
    }).pipe(Effect.catchTags({ UnknownComponentError: fail, InvalidConfigError: fail }))
).pipe(Command.withDescription("Copy components and everything they import into your app."))

const theme = Command.make(
  "theme",
  {
    base: Argument.String("base").pipe(Argument.withDescription("The theme to start from: shadcn or astryx.")),
    name: Flag.String("name").pipe(Flag.withDescription("Your theme's name."), Flag.withDefault("brand")),
    dir: Flag.String("dir").pipe(
      Flag.withDescription('Where the theme file goes. Defaults to "themes" in components.json, then src.'),
      Flag.optional
    ),
    ui,
    choices: Flag.String("choices").pipe(
      Flag.withDescription('Choices from the theme panel on the docs site, e.g. "accent=blue,radius=radius-12px".'),
      Flag.optional
    ),
    overwrite
  },
  (options) =>
    Effect.gen(function* () {
      const paths = yield* loadPaths(process.cwd(), { ui: options.ui, themes: options.dir })
      return yield* runTheme({
        base: options.base,
        name: options.name,
        dir: paths.themes,
        ui: paths.ui,
        choices: options.choices,
        overwrite: options.overwrite
      })
    }).pipe(
      Effect.catchTags({
        UnknownThemeError: fail,
        InvalidThemeNameError: fail,
        UnknownChoiceError: fail,
        InvalidConfigError: fail
      })
    )
).pipe(Command.withDescription("Start your own theme from a shipped one, or from your theme-panel choices."))

const install = Command.make(
  "install",
  {
    dryRun: Flag.Boolean("dry-run").pipe(
      Flag.withDescription("Print what would be installed and written, and change nothing."),
      Flag.withDefault(false)
    )
  },
  (options) =>
    runInstall(options).pipe(
      Effect.catchTags({ UnpublishedCliError: fail, CommandFailedError: fail, InvalidConfigError: fail })
    )
).pipe(
  Command.withDescription(
    "Install Effect, @effect/ui and Weft at this CLI's release, and add components.json, vite.config.ts and tsconfig.json if they're missing."
  )
)

const weft = Command.make("weft").pipe(Command.withSubcommands([install, add, theme]))

Command.run(weft, { version: "0.0.0" }).pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain)
