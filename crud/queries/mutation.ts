import { gql } from "npm:graphql-request";
import { completeTask } from "../task/task.ts";

export const mutations = {
    createDebrief: gql`
        mutation createDebrief($input: DebriefUpdate!) {
            createDebrief(input: $input) {
                id
            }
        }
    `,
    updateDebrief: gql`
        mutation updateDebrief($input: DebriefUpdate!) {
            updateDebrief(input: $input) {
                id
            }
        }
    `,
    deleteDebrief: gql`
        mutation deleteDebrief($id: ID!) {
            deleteDebrief(id: $id) 
        }
    `,
    updateTask: gql`
        mutation updateTask($input: TaskInput!) {
            updateTask(input: $input) {
                id
                completed
            }
        }
    `,
    
}