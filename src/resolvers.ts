import gql from "graphql-tag";
import { Cart, CART_QUERY, ICartFile } from "./util/Cart";

export const typeDefs = gql`
  extend type Query {
    """
    The cart content
    """
    cart: [CartFiles!]!
  }

  extend type Mutation {
    """
    Add files to the cart
    """
    addToCart(files: [CartFileInput!]!): Boolean!

    """
    Remove files from the cart
    """
    removeFromCart(files: [CartFileInput!]!): Boolean!
  }

  """
  A file in the cart
  """
  type CartFile {
    id: String!
    name: String!
    observation: CartObservation
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
    observation: CartObservationInput
  }

  """
  Input for an observation to which a file in the cart is linked
  """
  input CartObservationInput {
    id: String!
    name: String!
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
    }
  }
};
