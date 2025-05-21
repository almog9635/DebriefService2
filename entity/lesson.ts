import { Task } from "./task.ts";

export interface Lesson {
    id: string;
    content: string;
    tasks: Array<Task>;
    cluster: string;
}