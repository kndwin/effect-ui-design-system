import { assert, describe, it } from "@effect/vitest"
import { AppRoute } from "./app.route.ts"
import { getPage, getPageRoute } from "./app.pure.ts"

const search = { theme: "astryx", mode: "dark" } as const

describe("app pages", () => {
  it("finds the page for a route, and none for the 404", () => {
    // Arrange
    const routes = [
      AppRoute.Component({ params: { id: "avatar" }, search }),
      AppRoute.NotFound({ params: { "*": "x" }, search })
    ]
    // Act
    const titles = routes.map((route) => getPage({ route })?.title)
    // Assert
    assert.deepStrictEqual(titles, ["Avatar", undefined])
  })

  it("links to a page, keeping the theme and mode", () => {
    // Arrange
    const route = AppRoute.Tokens({ search })
    // Act
    const href = AppRoute.print(getPageRoute({ id: "code-block", route }))
    // Assert
    assert.strictEqual(href, "/components/code-block?theme=astryx&mode=dark")
  })
})
