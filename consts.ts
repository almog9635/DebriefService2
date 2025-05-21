import { Logger } from "./logger/logger.ts";

export const logger = Logger.getLogger();
// when using docker change it to host.docker.internal:
export const endpoint = "http://host.docker.internal:8080/graphql";