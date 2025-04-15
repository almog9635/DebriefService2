import { OrderedItem } from "./ordered-item.ts";

export interface ContentItem extends OrderedItem {
    id: string;
    name: string;
}