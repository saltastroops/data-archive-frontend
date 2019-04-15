import gql from "graphql-tag";

/**
 * Create a new user.
 *
 * The following arguments must be supplied.
 *
 * affiliation:
 *     The affiliation of the user, such as a university or an institute.
 * email:
 *     Email address. This will be stored in lower case.
 * familyName:
 *     The family name (surname).
 * givenName:
 *     The given name (first name).
 * password:
 *     The password, which must have at least 7 characters.
 * username:
 *     The username, which must not contain upper case letters.
 */
export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $familyName: String!
    $givenName: String!
    $username: String!
    $email: String!
    $affiliation: String!
    $password: String!
  ) {
    signup(
      familyName: $familyName
      givenName: $givenName
      username: $username
      email: $email
      affiliation: $affiliation
      password: $password
    ) {
      id
    }
  }
`;

/**
 * Log the user in.
 *
 * The following arguments must be supplied
 *
 * password:
 *     The password.
 * username:
 *     The uusername.
 */
export const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($username: String!, $password: String!) {
    login(password: $password, username: $username) @client
  }
`;

/**
 * Log the user out.
 */
export const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout @client
  }
`;
