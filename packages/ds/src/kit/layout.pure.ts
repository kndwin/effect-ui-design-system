// Descriptors for the components the design system owns outright: layout, Text, Swatch.
// Each has a single `root` part; see kit/element.pure.ts for how they render.
import { describe } from "./element.pure.ts"

export const Stack = describe("Stack")
export const StackItem = describe("StackItem")
export const Grid = describe("Grid")
export const GridSpan = describe("GridSpan")
export const Center = describe("Center")
export const Section = describe("Section")
export const Layout = describe("Layout")
export const LayoutHeader = describe("LayoutHeader")
export const LayoutPanel = describe("LayoutPanel")
export const LayoutContent = describe("LayoutContent")
export const LayoutFooter = describe("LayoutFooter")
export const Text = describe("Text")
export const Swatch = describe("Swatch")
