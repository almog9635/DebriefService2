

import { logger } from "./consts.ts";
import { Application, Context, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors"
import { requestLogger } from "./middleware/logger.ts";
import { errorHandler } from "./middleware/error.ts";
import { debriefRouter } from "./routes/debrief.ts";


logger.info("Deno microservice is running on http://localhost:4003");
const router = new Router();
router
  .all("(.*)", (ctx: Context) => {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
  });

const app = new Application();
app.use(errorHandler);
app.use(requestLogger);
app.use(oakCors({ origin: ["http://localhost:4000"] }));
app.use(debriefRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 4003 });