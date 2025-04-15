import { OrderedItemInput } from "../ordered-item.ts";
import { CellInput } from "./cell.ts";

export interface RowInput extends OrderedItemInput{
    cells: Array<CellInput>;
}