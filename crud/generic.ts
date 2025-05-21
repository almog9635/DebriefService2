import { logger } from "../consts.ts";
import { fetchGraphQL } from "../graphql-fetcher/graphql-fetcher.ts";

export class BaseService<T, D>{

    public async handleCreate(input: T, mutation : string, headers : Headers): Promise<D>{

        const creatorId = headers.get("User-Id");
        if(!creatorId){
            throw new Error("User-Id is required in the headers");
        }

        const data = await fetchGraphQL<D>(mutation, { input: input }, creatorId);

        return data;
    }

    public async handleDelete(id: string, mutation: string): Promise<boolean>{

        logger.info("deleting ", id);
        const data = await fetchGraphQL<boolean>(mutation, {id : id});

        return data;
    }

    public async handleUpdate(input: T, mutation : string, headers : Headers): Promise<D>{

        const modifierId = headers.get("User-Id");
        if(!modifierId){
            throw new Error("User-Id is required in the headers");
        }

        const data = await fetchGraphQL<D>(mutation, { input: input }, modifierId);
                
        return data;
    }

    public async handleGetAll(query: string): Promise<D[]>{

        const data = await fetchGraphQL<D[]>(query);

        return data;
    }

    public async handleGetById(id : string, query : string): Promise<D>{
        
        const data = await fetchGraphQL<D>(query, {id : id});

        return data;
    }
}