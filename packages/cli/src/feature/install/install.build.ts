import { fileURLToPath } from "node:url"
import { Array, Console, Data, Effect, FileSystem, Option, Path, Schema } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { loadConfig } from "../../platform/config/config.build.ts"
import { configFile } from "../../platform/config/config.constant.ts"
import { loadPackageRoot, runWriteFile } from "../../platform/recipe/recipe.build.ts"
import { componentsJson, tsconfig, viteConfig } from "./install.constant.ts"
import { getInstallCommands, getPackageManager, getRelease } from "./install.pure.ts"
import type { InstallOptions } from "./install.schema.ts"

export class UnpublishedCliError extends Data.TaggedError("UnpublishedCliError")<{}> {
  override get message() {
    return "weft: install needs @weft/cli from a release on pkg.pr.new, so it knows which release to install. Inside the Weft repository, use the workspace packages instead."
  }
}

export class CommandFailedError extends Data.TaggedError("CommandFailedError")<{
  readonly command: string
  readonly exitCode: number
}> {
  override get message() {
    return `weft: \`${this.command}\` exited with code ${this.exitCode}`
  }
}

const CliPackageSchema = Schema.Struct({ dependencies: Schema.Record(Schema.String, Schema.String) })

export const loadRelease = Effect.fn("cli/install/loadRelease")(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const root = yield* loadPackageRoot(fileURLToPath(import.meta.url))
  const text = yield* fs.readFileString(path.join(root, "package.json"))
  const { dependencies } = yield* Schema.decodeUnknownEffect(Schema.fromJsonString(CliPackageSchema))(text)
  return yield* Option.match(getRelease({ componentsSpecifier: dependencies["@weft/components"] ?? "" }), {
    onNone: () => Effect.fail(new UnpublishedCliError()),
    onSome: Effect.succeed
  })
})

export const runCommand = Effect.fn("cli/install/runCommand")(function* (command: ReadonlyArray<string>, cwd: string) {
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const [name = "", ...args] = command
  const handle = yield* spawner.spawn(
    ChildProcess.make(name, args, { cwd, stdin: "inherit", stdout: "inherit", stderr: "inherit" })
  )
  const exitCode = yield* handle.exitCode
  if (exitCode !== 0) return yield* new CommandFailedError({ command: command.join(" "), exitCode })
})

export const runInstall = Effect.fn("cli/install/runInstall")(function* (options: InstallOptions) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const cwd = process.cwd()
  const config = yield* loadConfig(cwd)
  const lockfiles = yield* Effect.filter(
    ["pnpm-lock.yaml", "bun.lock", "bun.lockb", "yarn.lock", "package-lock.json"],
    (file) => fs.exists(path.join(cwd, file))
  )
  const packageManager = getPackageManager({
    ...Option.match(Option.fromNullishOr(config.packageManager), {
      onNone: () => ({}),
      onSome: (configured) => ({ configured })
    }),
    lockfiles,
    ...Option.match(Option.fromNullishOr(process.env["npm_config_user_agent"]), {
      onNone: () => ({}),
      onSome: (userAgent) => ({ userAgent })
    })
  })
  const release = yield* loadRelease()
  for (const command of getInstallCommands({ packageManager, release })) {
    yield* Console.log(`$ ${command.join(" ")}`)
    if (!options.dryRun) yield* Effect.scoped(runCommand(command, cwd))
  }
  const files = Array.map(
    [
      [configFile, componentsJson],
      ["vite.config.ts", viteConfig],
      ["tsconfig.json", tsconfig]
    ] as const,
    ([file, content]) => [path.join(cwd, file), content] as const
  )
  for (const [file, content] of files) {
    if (options.dryRun) yield* Console.log(`  would add ${file} unless it exists`)
    else yield* runWriteFile(file, content, false)
  }
  yield* Console.log("Next: pnpm weft add button, then pnpm weft theme shadcn --name brand. Get started has the rest.")
})
