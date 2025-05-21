import { Request as OakRequest } from "@oak/oak";
import { Task } from "../../entity/task.ts";
import { TaskInput } from "../../input/task.ts";
import { BaseService } from "../generic.ts";
import { mutations } from "../queries/mutation.ts";
import { logger } from "../../consts.ts";

const baseService: BaseService<TaskInput, Task> = new BaseService<TaskInput, Task>();

export async function completeTask(req: OakRequest): Promise<boolean> {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.body.json();

    if (!body) {
        const errorMsg = "Invalid request body";
        throw new Error(errorMsg);
    }

    const input: TaskInput = {
        id: id,
        completed: true,
        ...body,
    };
    const headers = req.headers;
    const task = await baseService.handleUpdate(input, mutations.updateTask, headers);

    return task.updateTask.completed;
}
