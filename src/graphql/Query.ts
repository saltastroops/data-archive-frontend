import gql from "graphql-tag";

// TODO UPDATE
/**
 * Retrieving the user information.
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
      familyName
      givenName
      roles
    }
  }
`;

export { USER_QUERY };
