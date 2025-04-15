import { Context, Router } from "@oak/oak";
import { logger } from "../consts.ts";
import { createDebrief, deleteDebrief, getAllDebriefs, getDebriefById} from "../crud/debrief/debrief.ts";

export const debriefRouter = new Router();
debriefRouter
    .post("/debrief/create", async (ctx: Context) => {
        logger.info("Creating debrief...");
        try{   
            ctx.response.body = await createDebrief(ctx.request);
            ctx.response.status = 201;
        } catch (error) {
            logger.error("Error creating debrief: ", error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    })
    .get("/debrief/:id", async (ctx: Context) => { 
        logger.info("Fetching debrief...");
        try{
            ctx.response.body = await getDebriefById(ctx.request);
            ctx.response.status = 200;
        } catch (error) {
            logger.error("Error fetching debrief: ", error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    })
    .delete("/debrief/:id", async (ctx: Context) => {
        logger.info("Deleting debrief...");
        try{
            ctx.response.body = await deleteDebrief(ctx.request);
            ctx.response.status = 200;
        } catch (error) {
            logger.error("Error deleting debrief: ", error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    })
    .put("/debrief/:id", async (ctx: Context) => {
        logger.info("Updating debrief...");
        try{
            ctx.response.body = await createDebrief(ctx.request);
            ctx.response.status = 200;
        } catch (error) {
            logger.error("Error updating debrief: ", error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    })
    .get("/debriefs", async (ctx: Context) => {
        logger.info("Fetching all debriefs...");
        try{
            ctx.response.body = await getAllDebriefs();
            ctx.response.status = 200;
        } catch (error) {
            logger.error("Error fetching all debriefs: ", error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    });