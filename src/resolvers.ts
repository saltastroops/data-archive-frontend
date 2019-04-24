import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  type Query {
    """
    The currently logged in user.
    """
    user: User
  }

  extend type Mutation {
    """
    Log the user in.
    """
    login(username: String, password: String): Boolean

    """
    Log the user out.
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
     * Login mutation.
     *
     * It uses the API to authenticate and log the user in. If this is done
     * successfully, true is returned; otherwise the return value is false.
     *
     * Parameters:
     * -----------
     * username
     *    The username.
     * password
     *    The password.
     *
     * Returns:
     * --------
     * true
     */
    login: async (
      _: any,
      { username, password }: { username: string; password: string },
      { cache }: any
    ) => {
      const login = await api.login({
        password,
        username
      });

      // Always true
      return login.data.success;
    },

    /**
     * Logout mutation.
     *
     * It uses the API to log the user out.
     *
     * Returns:
     * --------
     * true
     */
    logout: async () => {
      const logout = await api.logout();

      // Always true
      return logout.data.success;
    }
  }
};
