import { Match } from "effect"
import type { MapGlobToRegExpInput } from "./vite.schema.ts"

const anyFolders = "@@ANY@@"

const escape = (text: string) => text.replace(/[.+^${}()|[\]\\]/g, "\\$&")

const mapSegment = (segment: string) =>
  Match.value(segment).pipe(
    Match.when("**", () => anyFolders),
    Match.orElse((plain) => escape(plain).replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]"))
  )

export const mapGlobToRegExp = ({ glob }: MapGlobToRegExpInput) =>
  new RegExp(
    `^${glob
      .split("/")
      .map(mapSegment)
      .join("/")
      .replaceAll(`${anyFolders}/`, "(?:.*/)?")
      .replace(new RegExp(`/${anyFolders}$`), "(?:/.*)?")}$`
  )
