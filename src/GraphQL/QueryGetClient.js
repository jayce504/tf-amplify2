import gql from "graphql-tag";

export default gql(`
query($id: ID!) {
  getClient(id: $id) {
    id
    name
    address
    phoneNumber
    allegedOffenses
    courtDates
    comments {
      __typename
      items {
        commentId
        content
        createdAt
      }
    }
  }
}`);