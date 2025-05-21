import { ZonedDateTime } from "../types/zoned-date-time.ts";

export interface Task {
    id: string;
    content: string;
    completed: boolean;
    startDate: ZonedDateTime;
    deadline: ZonedDateTime;
    user: string;
}