import { ZonedDateTime } from "../types/zoned-date-time.ts";

export interface Task {
    id: string;
    content: string;
    startDate: ZonedDateTime;
    deadline: ZonedDateTime;
    user: string;
}