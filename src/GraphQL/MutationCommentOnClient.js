import gql from "graphql-tag";

export default gql(`
mutation MutationCommentOnClient($clientId: ID! $content: String! $createdAt: String!) {
  commentOnClient(
    clientId: $clientId
    content: $content
    createdAt: $createdAt
  ) {
    clientId
    commentId
    createdAt
  }
}`);
