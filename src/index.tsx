import * as Sentry from "@sentry/browser";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import "bulma-badge/dist/css/bulma-badge.min.css";
import "bulma-extensions/bulma-tooltip/dist/css/bulma-tooltip.min.css";
import "bulma/css/bulma.css";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "react-virtualized/styles.css";

import App from "./App";
import { resolvers, typeDefs } from "./resolvers";
import cache from "./util/cache";

import * as serviceWorker from "./registerServiceWorker";
import { Cart, CART_QUERY } from "./util/Cart";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN
  });
}

const client = new ApolloClient({
  cache,
  link: createHttpLink({
    credentials: "include",
    uri: process.env.REACT_APP_BACKEND_URI
  }),
  resolvers,
  typeDefs
} as any);

// read cart from local storage
const cartContentString = localStorage.getItem("cart");
const cart = Cart.fromJSON(cartContentString);
cache.writeQuery({
  data: {
    cart: {
      __typename: "CartContent",
      files: cart.files,
      includeArcsFlatsBiases: cart.includeArcsFlatsBiases,
      includeStandardCalibrations: cart.includeStandardCalibrations
    }
  },
  query: CART_QUERY
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <div className={"container"}>
      <Router>
        <App />
      </Router>
    </div>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
