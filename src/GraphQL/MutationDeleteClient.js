import gql from "graphql-tag";

export default gql(`
mutation($id: ID!) {
  deleteClient(id: $id) {
    id
    name
    address
    phoneNumber
    allegedOffenses
    courtDates
    comments {
      items {
        commentId
      }
    }
  }
}`);
