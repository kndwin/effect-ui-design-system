import { Schema } from "effect"
import { BlockSchema } from "../content/block.schema.ts"
import { PageSchema } from "../content/content.schema.ts"

export const MapBlockToMarkdownInputSchema = Schema.Struct({ block: BlockSchema })
export type MapBlockToMarkdownInput = typeof MapBlockToMarkdownInputSchema.Type

export const GetPageMarkdownInputSchema = Schema.Struct({ page: PageSchema })
export type GetPageMarkdownInput = typeof GetPageMarkdownInputSchema.Type

export const GetMarkdownFilesInputSchema = Schema.Struct({ pages: Schema.Array(PageSchema) })
export type GetMarkdownFilesInput = typeof GetMarkdownFilesInputSchema.Type

export const MarkdownFileSchema = Schema.Struct({ path: Schema.String, content: Schema.String })
export type MarkdownFile = typeof MarkdownFileSchema.Type
