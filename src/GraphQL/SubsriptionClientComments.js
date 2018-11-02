import gql from "graphql-tag";

export default gql(`
subscription($clientId: String!) {
  subscribeToClientComments(clientId: $clientId) {
    clientId
    commentId
  }
}`);
