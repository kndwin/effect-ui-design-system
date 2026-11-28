import {
  CardsBlockSchema,
  CodeBlockSchema,
  type ContentSection,
  NoticeBlockSchema,
  TextBlockSchema
} from "../../platform/content/block.schema.ts"

const text = (value: string) => TextBlockSchema.make({ text: value })

export const modulesList = `@weft/design-system/TokenColor     Color tokens, and makeAlpha
@weft/design-system/TokenLength    Length tokens, and makeCalc
@weft/design-system/TokenDuration  Duration tokens
@weft/design-system/TokenFont      font stack tokens
@weft/design-system/TokenShadow    box-shadow tokens
@weft/design-system/TokenWeight    font weight tokens
@weft/design-system/Token          the Ref, Group and Input types
@weft/design-system/Kit            Kit.make and Kit.makeSingle: parts and their states
@weft/design-system/Variant        Variant.make and Variant.makeFlag
@weft/design-system/Style          Style.make, and Style.Props for a component's props
@weft/design-system/Rule           Decl, the typed CSS declarations a slot takes
@weft/design-system/StyleClasses   getStyleClasses: a compiled style's class names per slot
@weft/design-system/Element        Element.make: a styled element with one root
@weft/design-system/Theme          Theme.make
@weft/design-system/ThemeSchema    the shape of a compiled theme
@weft/design-system/ThemeSource    mapVarsToThemeSource: a theme written out as source
@weft/design-system/Manifest       Manifest.make: the contract and styles as data
@weft/design-system/Compile        the adapter @weft/css-engine compiles with`

export const tokensFile = `import * as TokenColor from "@weft/design-system/TokenColor"
import * as TokenDuration from "@weft/design-system/TokenDuration"
import * as TokenLength from "@weft/design-system/TokenLength"
import * as TokenWeight from "@weft/design-system/TokenWeight"

export const Colors = TokenColor.make("color", ["surface", "fg", "fgMuted", "accent", "accentFg"])
export const Spacing = TokenLength.make("spacing", [1, 2, 4])
export const Radius = TokenLength.make("radius", ["control", "full"])
export const Weight = TokenWeight.make("weight", ["regular", "semibold"])
export const Motion = TokenDuration.make("motion", ["fast"])

export const Tokens = { Colors, Spacing, Radius, Weight, Motion }
`

export const refsExample = `Colors.accent
// "var(--color-accent)", a Ref<"Color">

TokenColor.makeAlpha(Colors.accent, 12)
// "color-mix(in oklab, var(--color-accent) 12%, transparent)", still a Ref<"Color">

TokenLength.makeCalc\`\${Spacing[4]} * 2\`
// "calc(var(--spacing-4) * 2)", still a Ref<"Length">`

export const partsFile = `import * as Kit from "@weft/design-system/Kit"

const CardDescriptor = Kit.make({
  name: "Card",
  parts: {
    root: { states: { disabled: "[data-disabled]", selected: "[aria-selected=true]" } },
    title: { states: {} },
    body: { states: {} }
  },
  vars: {},
  pseudo: ["hover", "focusVisible"]
})

export interface CardParts extends Kit.Type<typeof CardDescriptor> {}
export const CardParts: CardParts = CardDescriptor

export const BadgeParts = Kit.makeSingle("Badge", { active: "[data-active]" })`

export const styleFile = `import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import * as Variant from "@weft/design-system/Variant"
import { Schema } from "effect"
import { BadgeParts, CardParts } from "./card.parts.constant.ts"
import { Colors, Motion, Radius, Spacing, Weight } from "./tokens.ts"

export const CardStyle = Style.make(CardParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      padding: Spacing[4],
      borderRadius: Radius.control,
      background: Colors.surface,
      transitionProperty: "background-color",
      transitionDuration: Motion.fast,
      states: {
        hover: { background: TokenColor.makeAlpha(Colors.accent, 6) },
        selected: { outlineStyle: "solid", outlineColor: Colors.accent },
        disabled: { opacity: 0.5 }
      },
      media: { narrow: { padding: Spacing[2] } }
    },
    title: { margin: 0, color: Colors.fg, fontWeight: Weight.semibold },
    body: { margin: 0, color: Colors.fgMuted }
  },
  variants: {
    tone: Variant.make(
      Schema.Literals(["plain", "accent"]),
      {
        plain: {},
        accent: { root: { background: Colors.accent }, title: { color: Colors.accentFg } }
      },
      { default: "plain" }
    ),
    compact: Variant.makeFlag({ root: { padding: Spacing[2] } })
  },
  compound: [{ when: { tone: "accent", compact: true }, root: { borderRadius: Radius.full } }]
})

export const BadgeStyle = Style.make(BadgeParts)({
  base: { root: { paddingInline: Spacing[1], borderRadius: Radius.full, states: { active: { color: Colors.accent } } } }
})`

export const typeErrors = `padding: 16                        // a raw length: use a Length token
color: "#000"                      // a raw colour: use a Color token
padding: Colors.accent             // a Color where a Length goes
states: { open: { opacity: 1 } }   // Badge has no "open" state`

export const componentFile = `import * as Element from "@weft/design-system/Element"
import type * as Style from "@weft/design-system/Style"
import { getStyleClasses } from "@weft/design-system/StyleClasses"
import type { Html } from "@effect/ui/html"
import { BadgeStyle, CardStyle } from "./card.component.style.ts"

export type CardProps = Style.Props<typeof CardStyle>

export const Card = <Msg>(h: Html.H<Msg>, options: CardProps & { readonly title: string; readonly body: string }) => {
  const classes = getStyleClasses({ style: CardStyle, props: options })
  return h.article.class(classes.root).children(
    h.h3.class(classes.title).children(options.title),
    h.p.class(classes.body).children(options.body)
  )
}

export const Badge = Element.make(BadgeStyle)
`

export const usageExample = `Card(h, { tone: "accent", compact: true, title: "Weft", body: "Styled at build time." })
Badge(h.span, { class: "extra" }).children("New")`

export const themeFile = `import * as Theme from "@weft/design-system/Theme"
import { Layer } from "effect"
import { Tokens } from "./tokens.ts"

export const brand = Theme.make(Tokens, {
  name: "brand",
  default: true,
  layer: Layer.mergeAll(
    Layer.succeed(Tokens.Colors, {
      surface: "#ffffff",
      fg: "oklch(0.21 0 0)",
      fgMuted: "oklch(0.55 0 0)",
      accent: "oklch(0.49 0.22 293)",
      accentFg: "#ffffff"
    }),
    Layer.succeed(Tokens.Spacing, { 1: 4, 2: 8, 4: "1rem" }),
    Layer.succeed(Tokens.Radius, { control: 6, full: 9999 }),
    Layer.succeed(Tokens.Weight, { regular: 400, semibold: 600 }),
    Layer.succeed(Tokens.Motion, { fast: "150 millis" })
  ),
  modes: {
    dark: Layer.succeed(Tokens.Colors, {
      surface: "oklch(0.18 0 0)",
      fg: "oklch(0.97 0 0)",
      fgMuted: "oklch(0.71 0 0)",
      accent: "oklch(0.65 0.2 293)",
      accentFg: "#ffffff"
    })
  }
})`

export const themeCss = `:root, [data-theme="brand"] {
  --color-surface: #ffffff;
  --color-accent: oklch(0.49 0.22 293);
  --spacing-1: 4px;
  --spacing-4: 1rem;
  --radius-control: 6px;
  --weight-semibold: 600;
  --motion-fast: 150ms;
  /* …every other token */
}
:root[data-mode="dark"], [data-theme="brand"][data-mode="dark"] {
  --color-surface: oklch(0.18 0 0);
  --color-accent: oklch(0.65 0.2 293);
  /* …only the values dark changes */
}`

export const themeError = `Theme "brand" has invalid token values:
expected #hex, rgb(), hsl() or oklch()
  at ["Colors"]["surface"]`

export const viteConfig = `import { makePlugin } from "@weft/css-engine/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    makePlugin({
      include: /\\.(component\\.style|theme)\\.ts$/,
      adapter: "@weft/design-system/Compile"
    })
  ]
})`

export const manifestExample = `import * as Manifest from "@weft/design-system/Manifest"
import { CardStyle } from "./card.component.style.ts"
import { Tokens } from "./tokens.ts"

export const manifest = Manifest.make({ tokens: Tokens, styles: [CardStyle] })

manifest.tokens.Colors     // { prefix: "color", kind: "Color", keys: ["surface", …] }
manifest.components[0]     // { kit: "Card", slots: ["root", "title", "body"], variants: { … } }`

export const designSystemNotice = NoticeBlockSchema.make({
  text: "@weft/design-system is the one Weft package your app depends on at runtime. It has no CSS framework under it: no Tailwind, StyleX or vanilla-extract. Styles are typed TypeScript objects, and @weft/css-engine compiles them to static CSS when Vite builds. The components you copy in with weft add are written with it, and so is anything you add yourself."
})

export const designSystemSections: ReadonlyArray<ContentSection> = [
  {
    heading: "How it fits together",
    blocks: [
      CardsBlockSchema.make({
        cards: [
          {
            title: "Tokens",
            text: "Typed names for design values. A contract is an object of token groups.",
            mono: false
          },
          { title: "Parts", text: "A ui-kit component's parts, and the states each one can be in.", mono: false },
          { title: "Styles", text: "Declarations per part, written only with tokens, plus variants.", mono: false },
          {
            title: "Themes",
            text: "Values for every token, provided as Effect layers, with modes on top.",
            mono: false
          },
          { title: "The build", text: "Styles become class names and themes become CSS variables.", mono: false },
          { title: "At runtime", text: "Props pick class names. Nothing is computed or injected.", mono: false }
        ]
      }),
      text(
        "A component never holds a colour or a size. It names tokens, and the theme on the page supplies their values as CSS variables. That's why swapping the theme restyles everything without touching a component. Every module is its own import, so you only pull in what you use."
      ),
      CodeBlockSchema.make({ code: modulesList, language: "plain", title: "modules" })
    ]
  },
  {
    heading: "Tokens",
    blocks: [
      text(
        "A token group is made by its kind's module: a CSS variable prefix and a list of keys. Each key becomes a reference to a CSS variable, typed by its kind, so a Length can never land where a Color is expected. Numeric keys work too, and a dot in a key becomes an underscore in the variable name."
      ),
      CodeBlockSchema.make({ code: tokensFile, title: "src/components/ui/tokens.ts" }),
      text(
        "The kind also decides which values a theme may give it, and how they're written to CSS. A value of the wrong shape fails the build."
      ),
      CardsBlockSchema.make({
        cards: [
          { title: "TokenColor", text: "#hex, rgb(), hsl() or oklch(), written as is.", mono: true },
          { title: "TokenLength", text: 'A number of pixels, or "<n>px" or "<n>rem". 8 becomes 8px.', mono: true },
          { title: "TokenDuration", text: 'An Effect duration such as "150 millis", written in ms.', mono: true },
          {
            title: "TokenFont",
            text: "A font stack as an array. Names other than lowercase keywords are quoted.",
            mono: true
          },
          { title: "TokenShadow", text: "A box-shadow value, or none.", mono: true },
          { title: "TokenWeight", text: "A number from 100 to 900.", mono: true }
        ]
      }),
      text(
        "A reference is just the var() string, so it works anywhere CSS does. makeAlpha mixes a Color with transparency and makeCalc builds a calc() from Lengths. Both keep their kind."
      ),
      CodeBlockSchema.make({ code: refsExample }),
      text(
        "Weft's own contract, with every group the components use, is on Theming, and Tokens lists each token with its value in the current theme."
      )
    ]
  },
  {
    heading: "Parts and states",
    blocks: [
      text(
        "A kit descriptor names the parts of a ui-kit component and the selectors for each part's states, usually the data attributes ui-kit sets. pseudo picks which of hover, focusVisible and active the parts can use. A style can only target these parts and states."
      ),
      CodeBlockSchema.make({ code: partsFile, title: "card.parts.constant.ts" }),
      text(
        "Kit.makeSingle is the short form for a single root part, with hover and focusVisible. Declaring the descriptor as an interface keeps its type short in hovers and declaration files."
      )
    ]
  },
  {
    heading: "Styles",
    blocks: [
      text(
        "Style.make takes a descriptor and returns a builder for that component's styles: base declarations per part, variants, and compound rules for combinations of variants. Under states, a key is one of the part's states and its declarations apply in that state. Under media, narrow applies at 860px and below."
      ),
      CodeBlockSchema.make({ code: styleFile, title: "card.component.style.ts", lineNumbers: true }),
      text(
        "Variant.make takes a Schema of literals and a style for each one, with an optional default. Variant.makeFlag is a boolean variant that's off by default. Each variant becomes an optional prop of the same name. A compound rule applies when every variant in when matches."
      ),
      text(
        "Declarations are csstype's, narrowed where a token belongs. Colour properties take only Color tokens. Spacing, sizes, radii, borders and font size take a Length token or one of 0, auto, none, 100%, 100vh and the content keywords. Durations, shadows, font family and font weight take their own kinds, and line height takes a Length or a plain number. Everything else is ordinary CSS. So a hard-coded value is a type error:"
      ),
      CodeBlockSchema.make({ code: typeErrors }),
      text(
        "When a component renders an element that isn't one of the kit's parts, pass extend to add slots: Style.make(MenuParts, { extend: [\"dangerItem\"] }). Extra slots can use the descriptor's pseudo states."
      )
    ]
  },
  {
    heading: "Using a style",
    blocks: [
      text(
        "Style files are named *.component.style.ts, and the build replaces each one with its class names. getStyleClasses gives you a class name per part for the props passed, with defaults filled in and compound rules applied. Style.Props is the props type, built from the variants."
      ),
      CodeBlockSchema.make({ code: componentFile, title: "card.ts" }),
      text(
        "For a style with only a root part, Element.make turns it into a function that styles any element and adds an optional class. Weft's Text, Stack and Section are made this way."
      ),
      CodeBlockSchema.make({ code: usageExample })
    ]
  },
  {
    heading: "Themes",
    blocks: [
      text(
        "Theme.make fills in a contract. Every token group is an Effect Context key, so a theme provides its values the way an app provides services: one Layer.succeed per group, merged into one layer. The compiler checks that each group lists every key, and Theme.make needs a layer for every group."
      ),
      CodeBlockSchema.make({ code: themeFile, title: "src/brand.theme.ts" }),
      text(
        "Each mode is a layer of the groups it changes. A theme is scoped by data-theme, and a mode by data-mode on the same element. default: true also puts the theme on :root, so the page needs no attribute. Only values that differ from the base end up in a mode's rule:"
      ),
      CodeBlockSchema.make({ code: themeCss, language: "plain", title: "the compiled CSS" }),
      text(
        "Values are decoded with their kind's schema when the theme is built. A bad value fails the build with the theme, the mode and the path of every value that's wrong:"
      ),
      CodeBlockSchema.make({ code: themeError, language: "plain" }),
      text(
        "weft theme writes a theme like this for you from a shipped one, and the theme panel writes one from your choices with ThemeSource. Theming shows both shipped themes in full."
      )
    ]
  },
  {
    heading: "The build",
    blocks: [
      text(
        "@weft/css-engine is a Vite plugin. It evaluates each file matching include during the build, hands every export to the adapter, and writes what comes back as static CSS. @weft/design-system/Compile is the adapter: it turns a style into one class per part, variant value and compound rule, and a theme into rules of CSS variables. weft install adds this config for you."
      ),
      CodeBlockSchema.make({ code: viteConfig, title: "vite.config.ts" }),
      text(
        "Outside the plugin, in a test without it say, a style is still its definition. getStyleClasses then fails with UncompiledStyleError, which says to add the plugin."
      )
    ]
  },
  {
    heading: "Manifest",
    blocks: [
      text(
        "Manifest.make describes a contract and its styles as plain data: each token group's prefix, kind and keys, and each component's slots and variants. It fails with DuplicatePrefixError if two groups share a prefix, since their variables would collide. The docs build the Tokens page and the theme panel from Weft's manifest."
      ),
      CodeBlockSchema.make({ code: manifestExample })
    ]
  },
  {
    heading: "Errors",
    blocks: [
      CardsBlockSchema.make({
        cards: [
          {
            title: "InvalidTokensError",
            text: "A theme value has the wrong shape. Thrown by Theme.make, so the build fails.",
            mono: true
          },
          {
            title: "UnknownStateError",
            text: "A style names a state its part doesn't have. A type error first, and a build error too.",
            mono: true
          },
          {
            title: "UncompiledStyleError",
            text: "getStyleClasses got a style the CSS engine didn't compile.",
            mono: true
          },
          {
            title: "DuplicatePrefixError",
            text: "Two token groups in a manifest share a CSS variable prefix.",
            mono: true
          }
        ]
      })
    ]
  }
]
