import gql from "graphql-tag";

// TODO UPDATE
/**
 * Retrieving the user information.
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
<<<<<<< HEAD
      givenName
=======
      familyName
      givenName
      roles
>>>>>>> development
    }
  }
`;

export { USER_QUERY };
