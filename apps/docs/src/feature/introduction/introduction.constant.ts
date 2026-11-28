import { CardsBlockSchema, type ContentSection, TextBlockSchema } from "../../platform/content/block.schema.ts"

export const introductionSections: ReadonlyArray<ContentSection> = [
  {
    heading: "Why Weft",
    blocks: [
      TextBlockSchema.make({
        text: "ui-kit gives you headless components: behaviour, focus and ARIA, with no look of their own. Weft is the thread woven through them. Every component is styled against a token contract, and a theme fills that contract in, so swapping the theme restyles everything without touching a component. As with shadcn, you copy the components into your app and they become yours."
      }),
      TextBlockSchema.make({
        text: "Styles are plain TypeScript checked by the compiler, and compiled to static CSS at build time by Weft's own Effect CSS engine. There's no runtime styling and no class-name soup in your views."
      })
    ]
  },
  {
    heading: "What's inside",
    blocks: [
      CardsBlockSchema.make({
        cards: [
          {
            title: "49 components",
            text: "Every ui-kit component with something to style, plus layout primitives and Text.",
            mono: false
          },
          {
            title: "10 templates",
            text: "Whole pages built only from the components: dashboards, forms, inboxes, boards.",
            mono: false
          },
          {
            title: "2 themes",
            text: "shadcn and astryx, each in light and dark, and a theme panel to make your own.",
            mono: false
          }
        ]
      })
    ]
  },
  {
    heading: "How it fits together",
    blocks: [
      CardsBlockSchema.make({
        cards: [
          {
            title: "@weft/design-system",
            text: "Token kinds, Theme, Variant and Style. The one package your app depends on.",
            mono: true
          },
          {
            title: "@weft/components",
            text: "The source you copy from: the token contract and every component styled against it.",
            mono: true
          },
          {
            title: "@weft/theme-*",
            text: "Reference themes, shadcn and astryx. Copy one to start your own.",
            mono: true
          }
        ]
      }),
      TextBlockSchema.make({ text: "Ready to build? Get started walks through a first app." })
    ]
  }
]
