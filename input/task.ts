import { ZonedDateTime } from "../types/zoned-date-time.ts";

export interface TaskInput {
    id?: string;
    content: string;
    startDate: ZonedDateTime;
    deadline: ZonedDateTime;
    user: string;
}