import gql from "graphql-tag";

/**
 * Creating a new user.
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
const SIGNUP_MUTATION = gql`
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

export { SIGNUP_MUTATION };
