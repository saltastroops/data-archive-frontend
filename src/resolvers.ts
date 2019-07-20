import gql from "graphql-tag";
import api from "./api/api";
import { Cart, CART_QUERY, ICartFile } from "./util/Cart";

export const typeDefs = gql`
  extend type Query {
    """
    The cart content
    """
    cart: [CartFiles!]!

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
  A file in the cart
  """
  type CartFile {
    id: String!
    name: String!
    observation: CartObservation!
    target: String
  }

  """
  An observation to which a file in the cart is linked
  """
  type CartObservation {
    id: String!
    name: String!
  }

  """
  Input for a file in the cart
  """
  input CartFileInput {
    id: String!
    name: String!
    observation: CartObservationInput!
    target: String
  }

  """
  Input for an observation to which a file in the cart is linked
  """
  input CartObservationInput {
    id: String!
    name: String!
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
    // Add files to the cart
    addToCart: async (_: any, { files }: any, { cache }: any) => {
      // Get current cart content
      const cart = new Cart(cache.readQuery({ query: CART_QUERY }).cart);

      // Add the files
      cart.add(files as [ICartFile]);

      // Store updated content both in the cache and in local storage
      localStorage.setItem("cart", JSON.stringify(cart.files));
      await cache.writeQuery({ query: CART_QUERY, data: { cart: cart.files } });

      return true;
    },

    // Remove files from the cart
    removeFromCart: async (_: any, { files }: any, { cache }: any) => {
      // Get current cart content
      const cart = new Cart(cache.readQuery({ query: CART_QUERY }).cart);

      // Remove the files
      cart.remove(files as [ICartFile]);

      // Store updated content both in the cache and in local storage
      localStorage.setItem("cart", JSON.stringify(cart.files));
      await cache.writeQuery({ query: CART_QUERY, data: { cart: cart.files } });

      return true;
    },

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
