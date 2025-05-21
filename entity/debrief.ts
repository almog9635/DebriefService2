import { ZonedDateTime } from "../types/zoned-date-time.ts";
import { ContentItem } from "./content/content-item.ts";
import { Lesson } from "./lesson.ts";
import { Task } from "./task.ts";

export interface Debrief{
    id: string;
    title: string;
    labels: string;
    date: ZonedDateTime;
    createdBy: string;
    updatedBy: string;
    contentItems: Array<ContentItem>;
    tasks: Array<Task>;
    lessons: Array<Lesson>;
}