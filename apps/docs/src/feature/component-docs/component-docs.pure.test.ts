import { assert, describe, it } from "@effect/vitest"
import { getInstallationSection } from "./component-docs.pure.ts"

describe("getInstallationSection", () => {
  it("installs with weft add and shows the style file as it lands in your app", () => {
    // Arrange
    const page = {
      id: "switch",
      section: "Components" as const,
      title: "Switch",
      lead: "",
      style: 'import { Colors } from "../../platform/token/contract.token.ts"',
      styleFile: "packages/components/src/feature/switch/switch.component.style.ts"
    }
    // Act
    const section = getInstallationSection({ page })
    // Assert
    assert.deepStrictEqual(
      section.blocks.filter((block) => "code" in block).map((block) => [block.code, block.title]),
      [
        ["pnpm weft add switch", undefined],
        ['import { Colors } from "./tokens.ts"', "src/components/ui/switch.component.style.ts"]
      ]
    )
  })
})
