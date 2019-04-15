import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  """
  User query which returns the user's content.
  """
  extend type Query {
    """
    User.
    """
    user: User
  }

  extend type Mutation {
    """
    Logging in the user provided correct credentials.
    """
    login(username: String, password: String): Boolean
  }

  """
  A data archive user.
  """
  type User {
    """
    User id.
    """
    id: ID!
    """
    Family name ("surname").
    """
    familyName: String!
    """
    Given name ("first name").
    """
    givenName: String!
    """
    Username, which must not contain upper case letters.
    """
    username: String!
    """
    Email address, which will be stored as lower case.
    """
    email: String!
    """
    Affiliation, such as a university or an institute.
    """
    affiliation: String!
    """
    User roles, which defines the user's permissions.
    """
    roles: [Role!]!
  }
`;

export const resolvers = {
  Mutation: {
    /**
     * A login mutation.
     * It authenticate and log the user in provided
     * a user submit correct credentials.
     *
     * The following arguments are required
     * password
     *    The correct user password
     * username
     *    The coreect user username
     *
     * It returns a boolean.
     * Where true indicates that the user successfuly logged in
     * and a false indicating the user logging in did not succeed.
     */
    login: async (_: any, variables: any, { cache }: any) => {
      const login = await api.login({
        password: variables.password,
        username: variables.username
      });

      // true if successful, false otherwise.
      return login.data.success;
    }
  }
};
