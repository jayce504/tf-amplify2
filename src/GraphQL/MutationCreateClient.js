import gql from "graphql-tag";

export default gql(`
mutation($name: String! $address: String! $phoneNumber: String! $allegedOffenses: String! $courtDates: String!) {
  createClient(
    name: $name
    address: $address
    phoneNumber: $phoneNumber
    allegedOffenses: $allegedOffenses
    courtDates: $courtDates
  ) {
    id,
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
