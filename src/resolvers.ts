import gql from "graphql-tag";
import api from "./api/api";
import { Cart, CART_QUERY, ICartFile } from "./util/Cart";

export const typeDefs = gql`
  extend type Query {
    """
    The cart content.
    """
    cart: CartContent!

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
  The cart content.
  """
  type CartContent {
    files: [CartFile!]!
    includeCalibrations: Boolean
    includeReducedCalibrationLevel: Boolean
    includeRawCalibrationLevel: Boolean
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
  Enumeration of the supported authentication providers.
  """
  enum AuthProvider {
    """
    This data archive.
    """
    SSDA

    """
    The SALT Science Database.
    """
    SDB
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
    Authentication provider.
    """
    authProvider: AuthProvider!

    """
    User roles, which define the user's permissions.
    """
    roles: [Role!]!
  }
`;

export const resolvers = {
  Mutation: {
    // Add files to the cart
    addToCart: async (_: any, { files }: any, { cache }: any) => {
      // Get current cart content
      const data = cache.readQuery({ query: CART_QUERY });
      const cart = new Cart(
        data.cart.files,
        data.cart.includeCalibrations,
        data.cart.includeReducedCalibrationLevel,
        data.cart.includeRawCalibrationLevel
      );

      // Add the files
      cart.add(files as [ICartFile]);

      // Store updated content both in the cache and in local storage
      await localStorage.setItem("cart", cart.toJSON());
      await cache.writeQuery({
        data: {
          cart: {
            __typename: "CartContent",
            files: cart.files,
            includeCalibrations: cart.includeCalibrations,
            includeRawCalibrationLevel: cart.includeRawCalibrationLevel,
            includeReducedCalibrationLevel: cart.includeReducedCalibrationLevel
          }
        },
        query: CART_QUERY
      });
      return true;
    },

    // Remove files from the cart
    removeFromCart: async (_: any, { files }: any, { cache }: any) => {
      // Get current cart content
      const data = cache.readQuery({ query: CART_QUERY });
      const cart = new Cart(
        data.cart.files,
        data.cart.includeCalibrations,
        data.cart.includeReducedCalibrationLevel,
        data.cart.includeRawCalibrationLevel
      );

      // Remove the files
      cart.remove(files as [ICartFile]);

      // Store updated content both in the cache and in local storage
      await localStorage.setItem("cart", cart.toJSON());
      await cache.writeQuery({
        data: {
          cart: {
            __typename: "CartContent",
            files: cart.files,
            includeCalibrations: cart.includeCalibrations,
            includeRawCalibrationLevel: cart.includeRawCalibrationLevel,
            includeReducedCalibrationLevel: cart.includeReducedCalibrationLevel
          }
        },
        query: CART_QUERY
      });

      return true;
    },

    // Clear the cart
    clearCart: async (_: any, args: any, { cache }: any) => {
      // Get current cart content
      const data = cache.readQuery({ query: CART_QUERY });
      const cart = new Cart(
        data.files,
        data.includeCalibrations,
        data.cart.includeReducedCalibrationLevel,
        data.cart.includeRawCalibrationLevel
      );

      // Remove the files
      cart.clear();

      // Store updated content both in the cache and in local storage
      await localStorage.setItem("cart", cart.toJSON());
      await cache.writeQuery({
        data: {
          cart: {
            __typename: "CartContent",
            files: cart.files,
            includeCalibrations: cart.includeCalibrations,
            includeRawCalibrationLevel: cart.includeRawCalibrationLevel,
            includeReducedCalibrationLevel: cart.includeReducedCalibrationLevel
          }
        },
        query: CART_QUERY
      });

      return true;
    },

    // Include calibrations in cart
    includeCalibrationsInCart: async (
      _: any,
      { includeCalibrations }: any,
      { cache }: any
    ) => {
      // Get current cart content
      const data = cache.readQuery({ query: CART_QUERY });
      const cart = new Cart(
        data.cart.files,
        data.cart.includeCalibrations,
        data.cart.includeReducedCalibrationLevel,
        data.cart.includeRawCalibrationLevel
      );

      // Update the flag for including calibrations
      cart.includeCalibrations = includeCalibrations;

      // Store updated content both in the cache and in local storage
      await localStorage.setItem("cart", cart.toJSON());
      await cache.writeQuery({
        data: {
          cart: {
            __typename: "CartContent",
            files: cart.files,
            includeCalibrations: cart.includeCalibrations,
            includeRawCalibrationLevel: cart.includeRawCalibrationLevel,
            includeReducedCalibrationLevel: cart.includeReducedCalibrationLevel
          }
        },
        query: CART_QUERY
      });

      return true;
    },

    // Include data type in cart
    calibrationLevelToIncludeInCart: async (
      _: any,
      { includeReducedCalibrationLevel, includeRawCalibrationLevel }: any,
      { cache }: any
    ) => {
      // Get current cart content
      const data = cache.readQuery({ query: CART_QUERY });
      const cart = new Cart(
        data.cart.files,
        data.cart.includeCalibrations,
        data.cart.includeReducedCalibrationLevel,
        data.cart.includeRawCalibrationLevel
      );

      // Update the flag for including reduced calibration level
      cart.includeReducedCalibrationLevel = includeReducedCalibrationLevel;
      // Update the flag for including raw calibration level
      cart.includeRawCalibrationLevel = includeRawCalibrationLevel;

      // Store updated content both in the cache and in local storage
      await localStorage.setItem("cart", cart.toJSON());
      await cache.writeQuery({
        data: {
          cart: {
            __typename: "CartContent",
            files: cart.files,
            includeCalibrations: cart.includeCalibrations,
            includeRawCalibrationLevel: cart.includeRawCalibrationLevel,
            includeReducedCalibrationLevel: cart.includeReducedCalibrationLevel
          }
        },
        query: CART_QUERY
      });

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
     * affiliation
     *    How users want to login
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
      {
        authProvider,
        username,
        password
      }: { authProvider: string; username: string; password: string },
      { cache }: any
    ) => {
      const login = await api.login({
        authProvider,
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
