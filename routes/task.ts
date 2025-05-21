import { Context, Router } from "@oak/oak";
import { logger } from "../consts.ts";
import { completeTask } from "../crud/task/task.ts";

export const taskRouter = new Router();
taskRouter
.put("/task/complete/:id", async (ctx: Context) => {
    logger.info("Completing task...");
    try{
        ctx.response.body = await completeTask(ctx.request);
        ctx.response.status = 200;
    } catch(error) {
        logger.error("Error completing task: ", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Internal server error" };
    }
});