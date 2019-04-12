import * as Sentry from "@sentry/browser";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import "bulma/css/bulma.css";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { resolvers, typeDefs } from "./resolvers";

import * as serviceWorker from "./registerServiceWorker";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN
  });
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    credentials: "include",
    uri: process.env.REACT_APP_BACKEND_URI
  }),
  resolvers,
  typeDefs
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
