import { Debrief } from "../../entity/debrief.ts";
import { Request as OakRequest } from "@oak/oak";
import { DebriefInput } from "../../input/debrief.ts";
import { BaseService } from "../../crud/generic.ts";
import { mutations } from "../../crud/queries/mutation.ts";
import { logger } from "../../consts.ts";
import { queries } from "../../crud/queries/query.ts";
import { extractSectionContent, formatDebriefDates, nullifyChildIds, sendForLabels } from "../../utils/debrief.ts";

const baseService: BaseService<DebriefInput, Debrief> = new BaseService<DebriefInput, Debrief>();

export async function createDebrief(req: OakRequest): Promise<Debrief> {
    const body = await req.body.json();
    
    if (!body) {
        const errorMsg = "Invalid request body";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const input: DebriefInput = await body;
    const combinedText: string = extractSectionContent(input, ["background", "trip progress", "route considerations"]);
    const lessonsArray: string[] = input.lessons.map((lesson) => lesson.content);
        const requestData = {
        texts: [combinedText],
        lessons: lessonsArray
    };
    
    const response = await sendForLabels(requestData, "/predict");
    const responseBody = await response.json();
    formatDebriefDates(input);
    input.labels = "";
    responseBody.tag_predictions[0].predicted_tags.forEach((tag: string) => {
        input.labels += tag + ", ";
    });

    let i = 0;
    input.lessons.forEach((lesson) => {
        lesson.cluster = responseBody.clustering_results.cluster_name[i];
        i++;
    });

    for (const field in input) {
        if (input[field] === undefined || input[field] === null) {
            const errorMsg = `Missing required field: ${field}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    nullifyChildIds(input);

    logger.info("Creating debrief with input:", input);
    const headers = req.headers;
    const debrief : Debrief = await baseService.handleCreate(input, mutations.createDebrief, headers);

    return debrief;
}

export async function updateDebrief(req: OakRequest): Promise<Debrief> {
    const body = await req.body.json();

    if (!body) {
        const errorMsg = "Invalid request body";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const input: DebriefInput = await body;
    const combinedText: string = extractSectionContent(input, ["background", "trip progress", "route considerations"]);
    const lessonsArray: string[] = input.lessons.map((lesson) => lesson.content);
    const requestData = {
        texts: [combinedText],
        lessons: lessonsArray
    };
    const response = await sendForLabels(requestData, "/predict");
    const responseBody = await response.json();
    formatDebriefDates(input);
    input.labels = "";
    responseBody.tag_predictions[0].predicted_tags.forEach((tag: string) => {
        input.labels += tag + ", ";
    });

    let i = 0;
    input.lessons.forEach((lesson) => {
        lesson.cluster = responseBody.clustering_results.cluster_name[i];
        i++;
    });

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    input.id = id;

    if (!id) {
        const errorMsg = "Missing ID parameter";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    logger.info(`input: ${input}`);
    const headers = req.headers;
    const debrief: Debrief = await baseService.handleUpdate(input, mutations.updateDebrief, headers);

    return debrief;
}

export async function deleteDebrief(req: OakRequest): Promise<boolean> {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    try {

        if (!id) {
            const errorMsg = "Missing ID parameter";
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data: boolean = await baseService.handleDelete(id, mutations.deleteDebrief);

        return data;
    } catch (error) {
        logger.error("Error deleting debrief: ", error);
        throw error;
    }
}

export async function getAllDebriefs(): Promise<Debrief[]> {
    const data: Debrief[] = await baseService.handleGetAll(queries.getAllDebriefs);

    return data;
}

export async function getDebriefById(req: OakRequest): Promise<Debrief> {
       try { 
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            const errorMsg = "Missing ID parameter";
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data: Debrief = await baseService.handleGetById(id, queries.debriefs);

        return data;
    } catch (error) {
        logger.error("Error fetching debrief: ", error);

        throw error;
    }
}