import { ContentItemInput } from "../content-item.ts";
import { ColumnInput } from "./column.ts";

export interface TableInput extends ContentItemInput {
    rows: Array<ColumnInput>;
    columns: Array<ColumnInput>;
}