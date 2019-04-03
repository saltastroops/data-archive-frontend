import * as Sentry from "@sentry/browser";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import "bulma/css/bulma.css";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import App from "./App";
import { resolvers, typeDefs } from "./resolvers";

import * as serviceWorker from "./registerServiceWorker";
import { CART_QUERY } from "./util/Cart";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN
  });
}

export const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: process.env.REACT_APP_BACKEND_URI
  }),
  resolvers,
  typeDefs
} as any);

// read cart from local storage
const cartContentString = localStorage.getItem("cart");
const cartContent = cartContentString ? JSON.parse(cartContentString) : [];
cache.writeQuery({ query: CART_QUERY, data: { cart: cartContent } });

ReactDOM.render(
  <ApolloProvider client={client}>
    <div className={"container"}>
      <App />
    </div>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
