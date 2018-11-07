import gql from "graphql-tag";

export default gql(`
mutation($name: String! $address: String! $phoneNumber: String! $allegedOffenses: String!) {
  createClient(
    name: $name
    address: $address
    phoneNumber: $phoneNumber
    allegedOffenses: $allegedOffenses
  ) {
    id
    name
    address
    phoneNumber
    allegedOffenses
  }
}`);
