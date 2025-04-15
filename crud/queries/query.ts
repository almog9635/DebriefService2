import { gql } from "npm:graphql-request";

export const queries = {
    getAllDebriefs: gql`
        query getAllDebriefs {
            getAllDebriefs {
                id
                title
                date
                metaData {
                    createdBy
                }
            }
        }`,

    debriefs: gql`
        query debriefs($id: ID!) {
          debriefs(input: {id: $id}) {
            id
            contentItems {
              ... on Table {
                id
                name
                index
                rows {
                  cells {
                    id
                    value
                  }
                  id
                  index
                }
                columns {
                  id
                  index
                  name
                }
              }
              ... on Paragraph {
                id
                name
                index
                comments {
                  bullet
                  id
                  index
                }
              }
            }
            date
            title
            lessons {
              content
              id
              tasks {
                content
                deadline
                id
                startDate
                user {
                  id
                }
              }
            }
            metaData {
              createdBy
              updatedBy
            }
            tasks {
              content
              deadline
              startDate
              id
              user{
                id
              }
            }
          }
        }`
}