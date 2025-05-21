import { logger } from "../consts.ts";
import { DebriefInput } from "../input/debrief.ts";


/**
 * Ensures a date string is in full ISO 8601 format with seconds and timezone
 * @param dateStr The date string to format
 * @returns Properly formatted date string for Java's ZonedDateTime
 */
export function formatZonedDateTime(dateStr: string): string {
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
export function logInputFields(input: Record<string, any>, prefix: string = "Input fields"): void {
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
export function formatDebriefDates(input: DebriefInput): void {
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
export function nullifyChildIds(input: DebriefInput): void {
    // Nullify IDs for tables
    if (input.tables && Array.isArray(input.tables)) {
        input.tables.forEach(table => {
            table.id = undefined;
        });
    }

    if(input.id) {
        input.id = undefined;
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

/* -----------------------------------------------------------*/

/**
 * Extracts text from specific sections and combines them
 * @param debrief The debrief input data
 * @param sectionNames Array of section names to include (case insensitive)
 * @returns Combined text from the specified sections
 */
export function extractSectionContent(debrief: DebriefInput, sectionNames: string[]): string {
    if (!debrief || !debrief.contentItems) {
        logger.warn("Cannot extract section content: debrief or contentItems is missing");
        return "";
    }
    
    let combinedText = "";
    const lowercaseSectionNames = sectionNames.map(name => name.toLowerCase());
    
    try {
        if (debrief.contentItems.paragraphs && Array.isArray(debrief.contentItems.paragraphs)) {
            const filteredParagraphs = debrief.contentItems.paragraphs.filter(paragraph => 
                paragraph.name && lowercaseSectionNames.includes(paragraph.name.toLowerCase())
            );
            
            filteredParagraphs.forEach(paragraph => {
                
                if (paragraph.comments && Array.isArray(paragraph.comments)) {
                    const sortedComments = [...paragraph.comments].sort((a, b) => 
                        (a.index !== undefined && b.index !== undefined) ? a.index - b.index : 0
                    );
                    
                    sortedComments.forEach(comment => {
                        if (comment.bullet && comment.bullet.trim() !== "") {
                            combinedText += `${comment.bullet} `;
                        }
                    });
                }
            });
        }

        return combinedText;
    } catch (error) {
        logger.error("Error extracting section content:", error);
        return "";
    }
}

export async function sendForLabels(data: any, endpoint: string) {
    try {
        const response = await fetch(`http://host.docker.internal:4005${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            logger.error(`Error calling service: ${response.status} ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        logger.error("Error sending text to service:", error);
        throw error;
    }
}