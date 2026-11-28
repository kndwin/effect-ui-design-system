import { Array, Match, Option } from "effect"
import type { PackageManager } from "../../platform/config/config.schema.ts"
import { effectUiBase, effectUiCommit, effectVersion, weftBase } from "./install.constant.ts"
import type { GetInstallCommandsInput, GetPackageManagerInput, GetReleaseInput } from "./install.schema.ts"

const lockfiles: ReadonlyArray<readonly [string, PackageManager]> = [
  ["pnpm-lock.yaml", "pnpm"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"]
]

const agents: ReadonlyArray<PackageManager> = ["pnpm", "bun", "yarn", "npm"]

export const getPackageManager = ({
  configured,
  lockfiles: present,
  userAgent
}: GetPackageManagerInput): PackageManager =>
  Option.getOrElse(
    Option.firstSomeOf([
      Option.fromNullishOr(configured),
      Option.map(
        Array.findFirst(lockfiles, ([file]) => present.includes(file)),
        ([, manager]) => manager
      ),
      Array.findFirst(agents, (agent) => (userAgent ?? "").startsWith(`${agent}/`))
    ]),
    (): PackageManager => "npm"
  )

export const getRelease = ({ componentsSpecifier }: GetReleaseInput): Option.Option<string> =>
  Option.fromNullishOr(/^https:\/\/pkg\.pr\.new\/.*@weft\/components@([\w.-]+)$/.exec(componentsSpecifier)?.[1])

export const getInstallCommands = ({
  packageManager,
  release
}: GetInstallCommandsInput): ReadonlyArray<ReadonlyArray<string>> => {
  const add = Match.value(packageManager).pipe(
    Match.when("npm", () => ["npm", "install"]),
    Match.orElse((manager) => [manager, "add"])
  )
  return [
    [
      ...add,
      `effect@${effectVersion}`,
      `${effectUiBase}/ui@${effectUiCommit}`,
      `${effectUiBase}/ui-kit@${effectUiCommit}`,
      `${weftBase}/design-system@${release}`
    ],
    [
      ...add,
      "-D",
      "vite@^8",
      "typescript",
      `${effectUiBase}/ui-devtools@${effectUiCommit}`,
      `${weftBase}/vite@${release}`,
      `${weftBase}/cli@${release}`
    ]
  ]
}
