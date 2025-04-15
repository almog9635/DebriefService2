import { request } from "npm:graphql-request";
import { logger, endpoint } from "../consts.ts";

export async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}, modifierId? : string) {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (modifierId) {
            headers["user-id"] = modifierId;
        }
        
        return await request<T>(endpoint, query, variables, headers);
    } catch (error) {
        logger.error("GraphQL request failed:", error);
        throw new Error("Failed to fetch data from GraphQL server");
    }
    
}