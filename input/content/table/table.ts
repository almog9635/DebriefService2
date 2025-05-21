import { ContentItemInput } from "../content-item.ts";
import { ColumnInput } from "./column.ts";
import { RowInput } from "./row.ts";

export interface TableInput extends ContentItemInput {
    rows: Array<RowInput>;
    columns: Array<ColumnInput>;
}