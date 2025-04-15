import { TaskInput } from "../input/task.ts";

export interface LessonInput {
    id?: string;
    content: string;
    tasks: Array<TaskInput>;
}