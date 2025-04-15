import { CommentInput } from "./comment.ts";
import { ContentItemInput } from "../content-item.ts";

export interface ParagraphInput extends ContentItemInput {
    comments: Array<CommentInput>;
}