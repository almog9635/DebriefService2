import { OrderedItemInput } from "./ordered-item.ts";
import { ParagraphInput } from "./paragraph/paragraph.ts";
import { TableInput } from "./table/table.ts";

export interface ContentItemInput extends OrderedItemInput {
    name: string;
}

export interface ContentInput {
    paragraphs: Array<ParagraphInput>;
    tables: Array<TableInput>;
}