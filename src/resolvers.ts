import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  extend type Query {
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
