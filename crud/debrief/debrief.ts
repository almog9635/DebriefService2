import { Debrief } from "../../entity/debrief.ts";
import { Request as OakRequest } from "@oak/oak";
import { DebriefInput } from "../../input/debrief.ts";
import { BaseService } from "../../crud/generic.ts";
import { mutations } from "../../crud/queries/mutation.ts";
import { logger } from "../../consts.ts";
import { queries } from "../../crud/queries/query.ts";

const baseService: BaseService<DebriefInput, Debrief> = new BaseService<DebriefInput, Debrief>();

export async function createDebrief(req: OakRequest): Promise<Debrief> {
    const body = await req.body.json();
    logger.info(body);
    if (!body) {
        const errorMsg = "Invalid request body";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const input: DebriefInput = await body;
    
    // Format all date fields in the input
    formatDebriefDates(input);
    
    // Set null IDs for all child elements in create operation
    nullifyChildIds(input);
    
    logInputFields(input, "Debrief input fields");

    for (const field in input) {
        if (input[field] === undefined || input[field] === null) {
            const errorMsg = `Missing required field: ${field}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    const headers = req.headers;
    const debrief = await baseService.handleCreate(input, mutations.createDebrief, headers);

    return debrief;
}

export async function updateDebrief(req: OakRequest): Promise<Debrief> {
    const body = await req.body.json();

    if (!body || !body.value) {
        const errorMsg = "Invalid request body";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const input: DebriefInput = await body.value;
    
    formatDebriefDates(input);
    
    const id = req.url.searchParams.get("id") || undefined;

    if (!id) {
        const errorMsg = "Missing ID parameter";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const headers = req.headers;
    const debrief = await baseService.handleUpdate(input, mutations.updateDebrief, headers);

    return debrief;
}

export async function deleteDebrief(req: OakRequest): Promise<boolean> {
    const id = req.url.searchParams.get("id") || undefined;
    try {

        if (!id) {
            const errorMsg = "Missing ID parameter";
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await baseService.handleDelete(id, mutations.deleteDebrief);

        return data;
    } catch (error) {
        logger.error("Error deleting debrief: ", error);
        throw error;
    }
}

export async function getAllDebriefs(): Promise<Debrief[]> {
    const data = await baseService.handleGetAll(queries.getAllDebriefs);

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

        const data = await baseService.handleGetById(id, queries.debriefs);

        return data;
    } catch (error) {
        logger.error("Error fetching debrief: ", error);

        throw error;
    }
}

/**
 * Ensures a date string is in full ISO 8601 format with seconds and timezone
 * @param dateStr The date string to format
 * @returns Properly formatted date string for Java's ZonedDateTime
 */
function formatZonedDateTime(dateStr: string): string {
    if (!dateStr) return dateStr;
    
    // Check if it already has seconds and timezone
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(dateStr)) {
        return dateStr; // Already properly formatted
    }
    
    // Check if it's missing seconds but has timezone
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(dateStr)) {
        return dateStr.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(Z|[+-]\d{2}:\d{2})$/, "$1:00$2");
    }
    
    // Check if it's missing timezone but has seconds
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?$/.test(dateStr)) {
        return `${dateStr}Z`;
    }
    
    // Missing both seconds and timezone
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateStr)) {
        return `${dateStr}:00Z`;
    }
    
    // Return original if we can't parse it
    return dateStr;
}

/**
 * Logs all fields and their values from an input object
 * @param input The input object to log
 * @param prefix Optional prefix for the log message
 */
function logInputFields(input: Record<string, any>, prefix: string = "Input fields"): void {
    logger.info(`${prefix}:`);
    
    // Log each field and its value
    for (const field in input) {
        if (Object.prototype.hasOwnProperty.call(input, field)) {
            const value = input[field];
            
            // Handle different types of values for better logging
            if (value === null) {
                logger.info(`  ${field}: null`);
            } else if (value === undefined) {
                logger.info(`  ${field}: undefined`);
            } else if (Array.isArray(value)) {
                logger.info(`  ${field}: Array with ${value.length} items`);
            } else if (typeof value === "object") {
                logger.info(`  ${field}: Object ${JSON.stringify(value)}`);
            } else {
                logger.info(`  ${field}: ${value}`);
            }
        }
    }
}

/**
 * Formats all date fields in a debrief input object to ensure they're compatible with Java's ZonedDateTime
 * @param input The DebriefInput object containing date fields to format
 */
function formatDebriefDates(input: DebriefInput): void {
    if (input.date) {
        input.date = formatZonedDateTime(input.date);
    }
    
    if (input.tasks && Array.isArray(input.tasks)) {
        input.tasks.forEach(task => {
            if (task.startDate) {
                task.startDate = formatZonedDateTime(task.startDate);
            }
            if (task.deadline) {
                task.deadline = formatZonedDateTime(task.deadline);
            }
        });
    }
    
    if (input.lessons && Array.isArray(input.lessons)) {
        input.lessons.forEach(lesson => {
            if (lesson.tasks && Array.isArray(lesson.tasks)) {
                lesson.tasks.forEach(task => {
                    if (task.startDate) {
                        task.startDate = formatZonedDateTime(task.startDate);
                    }
                    if (task.deadline) {
                        task.deadline = formatZonedDateTime(task.deadline);
                    }
                });
            }
        });
    }
}

/**
 * Sets the ID of all child elements (tables, tasks, lessons, paragraphs) to null
 * This ensures that new IDs will be generated when creating a debrief
 * @param input The DebriefInput object containing child elements
 */
function nullifyChildIds(input: DebriefInput): void {
    // Nullify IDs for tables
    if (input.tables && Array.isArray(input.tables)) {
        input.tables.forEach(table => {
            table.id = undefined;
        });
    }
    
    // Nullify IDs for tasks
    if (input.tasks && Array.isArray(input.tasks)) {
        input.tasks.forEach(task => {
            task.id = undefined;
        });
    }
    
    // Nullify IDs for lessons and their nested tasks
    if (input.lessons && Array.isArray(input.lessons)) {
        input.lessons.forEach(lesson => {
            lesson.id = undefined;
            
            if (lesson.tasks && Array.isArray(lesson.tasks)) {
                lesson.tasks.forEach(task => {
                    task.id = undefined;
                });
            }
        });
    }
    
    // Nullify IDs for paragraphs
    if (input.paragraphs && Array.isArray(input.paragraphs)) {
        input.paragraphs.forEach(paragraph => {
            paragraph.id = undefined;
        });
    }
}