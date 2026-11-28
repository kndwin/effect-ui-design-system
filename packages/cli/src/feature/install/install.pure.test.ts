import { assert, describe, it } from "@effect/vitest"
import { Option } from "effect"
import { getInstallCommands, getPackageManager, getRelease } from "./install.pure.ts"

describe("getPackageManager", () => {
  it("prefers components.json, then the lockfile, then the user agent", () => {
    // Arrange
    const inputs = [
      { configured: "bun" as const, lockfiles: ["pnpm-lock.yaml"] },
      { lockfiles: ["yarn.lock"], userAgent: "pnpm/11.0.0 node/v24" },
      { lockfiles: [], userAgent: "pnpm/11.0.0 node/v24" },
      { lockfiles: [] }
    ]
    // Act
    const managers = inputs.map(getPackageManager)
    // Assert
    assert.deepStrictEqual(managers, ["bun", "yarn", "pnpm", "npm"])
  })
})

describe("getRelease", () => {
  it("reads the release from the CLI's own pinned dependency", () => {
    // Arrange
    const specifiers = ["https://pkg.pr.new/kndwin/weft/@weft/components@a1b2c3d", "workspace:*"]
    // Act
    const releases = specifiers.map((componentsSpecifier) => getRelease({ componentsSpecifier }))
    // Assert
    assert.deepStrictEqual(releases, [Option.some("a1b2c3d"), Option.none()])
  })
})

describe("getInstallCommands", () => {
  it("adds the runtime and dev packages pinned to one release", () => {
    // Arrange
    const input = { packageManager: "npm" as const, release: "a1b2c3d" }
    // Act
    const [runtime, dev] = getInstallCommands(input)
    // Assert
    assert.deepStrictEqual(runtime?.slice(0, 3), ["npm", "install", "effect@4.1.6"])
    assert.include(runtime?.at(-1), "/@weft/design-system@a1b2c3d")
    assert.deepStrictEqual(dev?.slice(0, 3), ["npm", "install", "-D"])
    assert.include(dev?.at(-1), "/@weft/cli@a1b2c3d")
  })
})
