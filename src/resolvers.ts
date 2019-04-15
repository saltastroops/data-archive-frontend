import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  """
  User query which returns the user's content.
  """
  type Query {
    """
    User.
    """
    user: User
  }

  extend type Mutation {
    """
    The user logging in mutation provided correct credentials.
    """
    login(username: String, password: String): Boolean

    """
    The user logging out mutation
    """
    logout: Boolean
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
     * and a false otherwise.
     */
    login: async (_: any, variables: any, { cache }: any) => {
      const login = await api.login({
        password: variables.password,
        username: variables.username
      });

      // true if successful, false otherwise.
      return login.data.success;
    },

    /**
     * A logout mutation.
     * It logging the user out
     *
     * It returns a boolean.
     * Where true indicates that the user successfuly logged in
     * and a false otherwise.
     */
    logout: async (_: any, variables: any, { cache }: any) => {
      const logout = await api.logout();

      // true if successful, false otherwise.
      return logout.data.success;
    }
  }
};
