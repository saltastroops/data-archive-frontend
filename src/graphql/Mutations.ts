import gql from "graphql-tag";

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
