import { ZonedDateTime } from "../types/zoned-date-time.ts";
import { ContentInput } from "./content/content-item.ts";
import { LessonInput } from "./lesson.ts";
import { TaskInput } from "./task.ts";

export interface DebriefInput {
    id?: string;
    title: string;
    contentItems: ContentInput;
    labels: string;
    date: ZonedDateTime;
    lessons: Array<LessonInput>;
    tasks: Array<TaskInput>;
    user: string;
    [key: string]: any;
}