import gql from "graphql-tag";

// TODO UPDATE
/**
 * Retrieving the user information.
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
      givenName
    }
  }
`;

export { USER_QUERY };
